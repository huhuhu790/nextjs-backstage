import { removeUserSession } from '@/db/redis/redis';
import { getHeadUserData } from '@/utils/getHeadUserData';
import { buildResponse } from '@/utils/buildResponse';
import { headers } from 'next/headers';

// 登录，无需权限
export async function POST() {
    try {
        // 获取用户信息
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        if (!userData) throw new Error("未找到用户");
        // 移除Redis中的会话记录
        await removeUserSession(userData.id);

        // 创建响应并清除cookie
        const nextResponse = buildResponse({
            status: 200,
            message: '登出成功'
        });
        nextResponse.cookies.delete('accessToken');

        return nextResponse;
    } catch (error) {
        console.error(error);

        return buildResponse({
            status: 401,
            message: '登出失败'
        });
    }
}