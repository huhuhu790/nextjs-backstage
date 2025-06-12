import { updatePassword } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { buildResponse } from "@/utils/buildResponse";
import { checkProps } from "@/utils/checkProps";
export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const data: {
            originPassword: string,
            newPassword: string,
            id: string
        } = await request.json()
        if (data.id !== userData.id) throw new Error('无权限操作')
        checkProps(data, ['originPassword', 'newPassword', 'id']);
        await updatePassword(data, userData.id)
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