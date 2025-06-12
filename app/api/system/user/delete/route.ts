import { checkPermission, deleteOneUser } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { deleteOneUserPermission } from "../permission";
import { buildResponse } from "@/utils/buildResponse";
import { checkProps } from "@/utils/checkProps";
export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(deleteOneUserPermission, userData)
        const body: { id: string } = await request.json()
        checkProps(body, ['id']);
        await deleteOneUser(body.id, userId)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '删除成功'
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '删除用户失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}