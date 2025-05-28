import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/tokenAuth';
import { verifySession } from '@/db/redis/redis';
import { getUserInfo } from './db/mongodb/userCollection';
import { toLocalUser } from '@/app/api/system/user/userDataTrans';

// 无需登录可访问的页面或接口
export const publicPaths = ['/login', '/api/auth/login'];

function clearToken(request: NextRequest, query?: string) {
  const response = NextResponse.redirect(new URL(`/login${query ? '?revoked=' + query : ''}`, request.url));
  response.cookies.delete('accessToken');
  return response;
}

/**
 * 1: 令牌无效或者过期
 * 2: 别处登录
 */
async function verifyTokenStatus(accessToken: string) {
  try {
    const payload = await verifyToken(accessToken);
    if (payload && payload.jti && payload.userId) {
      const hasPermission = await verifySession(payload.jti, payload.userId);
      if (hasPermission) return {
        success: true,
        userId: payload.userId
      }
    }
    throw new Error("验证失败");
  } catch (error) {
    console.log(error);

    return {
      success: false,
      errorType: "1",
    }
  }
}

export async function middleware(request: NextRequest) {
  let response: NextResponse | null = null, userId: string | null = null;
  const pathname = request.nextUrl.pathname;
  // 如果访问根目录，跳转到系统首页
  if (pathname === "/") return NextResponse.redirect(new URL("/dashboard", request.url));
  // 查询session中是否存在token
  const accessToken = request.cookies.get('accessToken')?.value;
  // 判断是否访问非公共页面
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  // 如果存在，验证token是否有效
  if (accessToken) {
    try {
      const result = await verifyTokenStatus(accessToken);
      if (!result.success) throw new Error(result.errorType);
      userId = result.userId!;
      // 将请求的时间，用户id，与请求路径添加到日志中
      console.log(`[${new Date()}] [${userId}] [${pathname}]`);
      // 验证成功，如果访问登录页面，跳转到系统首页
      if (pathname.startsWith('/login'))
        response = NextResponse.redirect(request.url);
      else {
        // 验证成功，访问受限页面,将用户信息添加到请求头中，继续访问
        const requestHeaders = new Headers(request.headers);
        const userData = await getUserInfo(userId);
        const userDataString = encodeURIComponent(userData ? JSON.stringify(toLocalUser(userData)) : '');
        requestHeaders.set(process.env.SERVER_USERHEADER!, userDataString);
        response = NextResponse.next({
          request: {
            headers: requestHeaders
          }
        });
      }
    } catch (error) {
      console.log(error);
      const errorMessage = (error as Error).message;
      //验证失败，删除token，跳转到登录页面
      response = clearToken(request, errorMessage);
    }
  }
  // 如果无权限且访问非公共页面，跳转到登录页面
  else if (!isPublicPath) response = NextResponse.redirect(new URL('/login', request.url));

  if (response) return response;
  // 如果无权限且访问公共页面，继续访问
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}