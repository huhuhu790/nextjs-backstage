import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { checkPermission } from "@/db/mongodb/userCollection";
import { sendingMessagePermission } from "../permission";
import { sendingMessage } from "@/db/mongodb/messageCollection";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(sendingMessagePermission, userData)
        const body = await request.json()
        await sendingMessage(body, userId)

        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '发送成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '发送失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
}