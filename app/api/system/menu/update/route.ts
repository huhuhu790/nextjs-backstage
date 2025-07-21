import { checkPermission } from "@/db/mongodb/userCollection";
import { LocalMenu } from "@/types/api";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { updateOneMenu } from "@/db/mongodb/menuCollection";
import { updateOneMenuPermission } from "@/utils/appRoutePermission";
import { buildResponse } from "@/utils/serverUtils";
import { checkProps } from "@/utils/serverUtils";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(updateOneMenuPermission, userData)
        const data: LocalMenu = await request.json()
        checkProps(data, ['id', 'name', 'path', 'type', 'iconPath']);
        await updateOneMenu(data, userId)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '更新成功'
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '更新目录失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}