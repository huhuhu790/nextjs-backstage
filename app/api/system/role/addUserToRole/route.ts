import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { addUserToRolePermission } from "../permission";
import { addUserToRole } from "@/db/mongodb/roleCollection";
import { buildResponse } from "@/utils/buildResponse";
import { checkProps } from "@/utils/checkProps";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(addUserToRolePermission, userData)
        const data: { id: string, userIds: string[] } = await request.json()
        checkProps(data, ['id', 'userIds']);
        await addUserToRole(data.id, data.userIds, userId)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '更新成功'
        })
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '更新角色失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 