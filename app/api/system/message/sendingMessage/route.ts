import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { checkPermission } from "@/db/mongodb/userCollection";
import { sendingMessagePermission } from "@/utils/appRoutePermission";
import { sendingMessage } from "@/db/mongodb/messageCollection";
import { buildResponse } from "@/utils/serverUtils";
import { checkProps } from "@/utils/serverUtils";
import { LocalMessage } from "@/types/api";
import { sendingMessagesEvent } from "@/kafka/producer";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(sendingMessagePermission, userData)
        const body: LocalMessage = await request.json()
        checkProps(body, ['title', 'content']);
        await sendingMessage(body, userId)
        await sendingMessagesEvent({
            message: body,
            operatorId: userId
        });

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