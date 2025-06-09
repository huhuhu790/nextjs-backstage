import { checkPermission, updateRoleToUser } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { updateRoleToUserPermission } from "../permission";
import { buildResponse } from "@/utils/buildResponse";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(updateRoleToUserPermission, userData)
        const body: { id: string, roleIds: string[] } = await request.json()
        await updateRoleToUser(body.id, body.roleIds, userId)
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