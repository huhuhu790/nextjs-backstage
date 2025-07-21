import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { insertOneRolePermission } from "@/utils/appRoutePermission";
import { insertOneRole } from "@/db/mongodb/roleCollection";
import { buildResponse } from "@/utils/serverUtils";
import { LocalRole } from "@/types/api";
import { checkProps } from "@/utils/serverUtils";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(insertOneRolePermission, userData)
        const data: LocalRole = await request.json()
        checkProps(data, ['name']);
        const result = await insertOneRole(data, userId)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '添加成功',
            data: {
                id: result.insertedId.toString(),
                name: data.name,
                description: data.description,
                permissions: data.permissions,
                users: data.users,
            }
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '添加角色失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 