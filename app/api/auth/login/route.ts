import { generateAccessToken, verifyToken } from '@/utils/tokenAuth';
import { setUserSession, removeUserSession } from '@/db/redis/redis';
import { getPermissions, verifyUserCredentials } from '@/db/mongodb/userCollection';
import { EXPIRED_TIME } from '@/utils/getExpiredTime';
import { toLocalUser } from '@/app/api/system/user/dataTransform';
import { buildResponse } from '@/utils/buildResponse';

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


        const nextResponse = buildResponse({
            status: 200,
            data: {
                userInfo: localUser,
                permission: permissions
            },
            message: '登录成功'
        });
        nextResponse.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: EXPIRED_TIME,
            path: '/'
        });

        return nextResponse;
    } catch (error) {
        console.error(error);
        return buildResponse({
            status: 401,
            message: '登录失败'
        });
    }
}