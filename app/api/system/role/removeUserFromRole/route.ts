import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { removeUserFromRolePermission } from "@/utils/appRoutePermission";
import { removeUserFromRole } from "@/db/mongodb/roleCollection";
import { buildResponse } from "@/utils/serverUtils";
import { checkProps } from "@/utils/serverUtils";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(removeUserFromRolePermission, userData)
        const data: { id: string, userIds: string[] } = await request.json()
        checkProps(data, ['id', 'userIds']);
        await removeUserFromRole(data.id, data.userIds, userId)
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