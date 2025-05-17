import { generateAccessToken, verifyToken } from '@/utils/server/auth';
import { setUserSession, removeUserSession } from '@/db/redis/redis';
import { NextResponse } from 'next/server';
import { ApiResponse, LocalUser } from '@/types/api';
import { verifyUserCredentials } from '@/db/mongodb/userCollection';
import { EXPIRED_TIME } from '@/utils/server/time';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        // 验证用户凭据
        const user = await verifyUserCredentials({ username, password });
        if (!user) {
            const response: ApiResponse = {
                status: 401,
                success: false,
                message: 'Invalid credentials'
            };
            return NextResponse.json(response);
        }

        // 移除旧会话并创建新会话
        const userId = user._id.toString();
        await removeUserSession(userId);
        const accessToken = await generateAccessToken(userId);
        const JWTPayload = await verifyToken(accessToken);
        const jti = JWTPayload?.jti;

        if (!jti) {
            const response: ApiResponse = {
                status: 500,
                success: false,
                message: 'Token generation failed'
            };
            return NextResponse.json(response);
        }

        await setUserSession(userId, jti, EXPIRED_TIME);
        const { _id, password: _, ...userItem } = user
        // 成功响应
        const response: ApiResponse<LocalUser> = {
            status: 200,
            success: true,
            data: {
                id: userId,
                ...userItem
            },
            message: 'Login successful'
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
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: 'Internal server error'
        };
        return NextResponse.json(response);
    }
}