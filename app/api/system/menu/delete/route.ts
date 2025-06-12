import { deleteOneMenu } from "@/db/mongodb/menuCollection";
import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { deleteOneMenuPermission } from "../permission";
import { buildResponse } from "@/utils/buildResponse";
import { checkProps } from "@/utils/checkProps";

export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(deleteOneMenuPermission, userData)
        const data: { id: string } = await request.json()
        checkProps(data, ['id']);
        await deleteOneMenu(data.id, userId)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '删除成功'
        })
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '删除目录失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}