import { getMessageListByPage } from "@/db/mongodb/messageCollection";
import { ApiResponse, LocalMessage } from "@/types/api";
import { PaginationResponse } from "@/types/database";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { toLocalMessageList } from "../messageDataTrans";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        if (!userData || !userData.id) throw new Error('用户未登录')
        const body = await request.json()
        const { data, ...records } = await getMessageListByPage(userData, body)

        // 成功响应
        const response: ApiResponse<PaginationResponse<LocalMessage[]>> = {
            status: 200,
            success: true,
            message: '获取成功',
            data: {
                data: toLocalMessageList(data),
                ...records
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        const message = (error as Error).message || '获取失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
}