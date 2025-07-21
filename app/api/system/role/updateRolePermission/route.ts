import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { updatePermissionToRolePermission } from "@/utils/appRoutePermission";
import { updatePermissionToRole } from "@/db/mongodb/roleCollection";
import { buildResponse } from "@/utils/serverUtils";
import { checkProps } from "@/utils/serverUtils";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(updatePermissionToRolePermission, userData)
        const data: { id: string, permissions: string[] } = await request.json()
        checkProps(data, ['id', 'permissions']);
        await updatePermissionToRole(data.id, data.permissions, userId)
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