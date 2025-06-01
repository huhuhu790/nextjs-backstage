import { removeUserSession } from '@/db/redis/redis';
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';
import { getHeadUserData } from '@/utils/getHeadUserData';

// 登录，无需权限
export async function POST(request: Request) {
    try {
        // 获取用户信息
        const userData = await getHeadUserData()
        if (!userData) throw new Error("未找到用户");
        // 移除Redis中的会话记录
        await removeUserSession(userData.id);
        // 验证令牌并获取用户信息

        // 构建标准响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '登出成功'
        };

        // 创建响应并清除cookie
        const nextResponse = NextResponse.json(response);
        nextResponse.cookies.delete('accessToken');

        return nextResponse;
    } catch (error) {
        console.error(error);
        
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: '登出失败'
        };
        return NextResponse.json(response);
    }
}