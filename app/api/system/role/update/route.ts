import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { updateOneRolePermission } from "../permission";
import { updateOneRole } from "@/db/mongodb/roleCollection";
import { buildResponse } from "@/utils/buildResponse";

export async function POST(request: Request) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(updateOneRolePermission, userData)
        const data = await request.json()
        await updateOneRole(data, userId)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '更新成功'
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '更新角色失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 