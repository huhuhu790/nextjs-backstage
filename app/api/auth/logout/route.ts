import { removeUserSession } from '@/db/redis/redis';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

export async function POST(request: Request) {
    try {
        // 获取用户信息
        const userId = request.headers.get('x-user-id');
        if (!userId) throw new Error("User not found");
        // 移除Redis中的会话记录
        await removeUserSession(userId);
        // 验证令牌并获取用户信息

        // 构建标准响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: 'Logout successful'
        };

        // 创建响应并清除cookie
        const nextResponse = NextResponse.json(response);
        nextResponse.cookies.delete('accessToken');

        return nextResponse;
    } catch (error) {
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: 'Logout failed'
        };
        return NextResponse.json(response);
    }
}