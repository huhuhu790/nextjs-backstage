import { generateAccessToken, verifyToken } from '@/utils/tokenAuth';
import { setUserSession, removeUserSession } from '@/db/redis/redis';
import { NextResponse } from 'next/server';
import { ApiResponse, LocalUser } from '@/types/api';
import { getPermissions, verifyUserCredentials } from '@/db/mongodb/userCollection';
import { EXPIRED_TIME } from '@/utils/getExpiredTime';
import { toLocalUser } from '@/app/api/system/user/userDataTrans';

// 登录，无需权限
export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // 验证用户凭据
        const user = await verifyUserCredentials({ username, password });
        if (!user) { throw new Error("无用户信息") }

        // 移除可能存在的已登录会话并创建新会话
        const userId = user.id;
        await removeUserSession(userId);
        const accessToken = await generateAccessToken(userId);
        const JWTPayload = await verifyToken(accessToken);
        const jti = JWTPayload?.jti;

        if (!jti) {
            throw new Error("生成token失败")
        }

        await setUserSession(userId, jti, EXPIRED_TIME);
        const localUser = toLocalUser(user);
        const permissions = await getPermissions(user.roles)
        // 成功响应
        const response: ApiResponse<{ userInfo: LocalUser, permission: string[] }> = {
            status: 200,
            success: true,
            data: {
                userInfo: localUser,
                permission: permissions
            },
            message: '登录成功'
        };

        const nextResponse = NextResponse.json(response);
        nextResponse.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: EXPIRED_TIME,
            path: '/'
        });

        return nextResponse;
    } catch (error) {
        console.error(error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: '登录失败'
        };
        return NextResponse.json(response);
    }
}