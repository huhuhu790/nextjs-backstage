import { updatePassword } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { buildResponse } from "@/utils/buildResponse";
export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        if (!userData) throw new Error('请先登录')
        const data = await request.json()
        if (data.id !== userData.id) throw new Error('无权限操作')
        const result = await updatePassword(data, userData.id)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '更新成功'
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '更新失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}  