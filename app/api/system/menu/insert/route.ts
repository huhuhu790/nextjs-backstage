import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { insertOneMenu } from "@/db/mongodb/menuCollection";
import { LocalMenu } from "@/types/api";
import { insertOneMenuPermission } from "@/utils/appRoutePermission";
import { buildResponse } from "@/utils/serverUtils";
import { checkProps } from "@/utils/serverUtils";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(insertOneMenuPermission, userData)
        const data: LocalMenu = await request.json()
        checkProps(data, ['name', 'path', 'iconPath', 'type']);
        const result = await insertOneMenu(data, userId)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '添加成功',
            data: {
                id: result.insertedId.toString(),
                parentId: data.parentId!,
                name: data.name!,
                path: data.path!,
                iconPath: data.iconPath!,
                type: data.type!,
            }
        })
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '添加目录失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}