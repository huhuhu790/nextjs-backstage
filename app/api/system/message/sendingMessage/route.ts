import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { checkPermission } from "@/db/mongodb/userCollection";
import { sendingMessagePermission } from "../permission";
import { sendingMessage } from "@/db/mongodb/messageCollection";
import { buildResponse } from "@/utils/buildResponse";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(sendingMessagePermission, userData)
        const body = await request.json()
        await sendingMessage(body, userId)

        // 成功响应
        return buildResponse({
            status: 200,
            message: '发送成功'
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '发送失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}