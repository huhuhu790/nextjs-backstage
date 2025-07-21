import { getListByPageMessage } from "@/db/mongodb/messageCollection";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { toLocalMessageList } from "../dataTransform";
import { buildResponse } from "@/utils/serverUtils";
import { PaginationRequest } from "@/types/database";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const body: PaginationRequest = await request.json()
        const { data, ...records } = await getListByPageMessage(userData, body)

        // 成功响应
        return buildResponse({
            status: 200,
            message: '获取成功',
            data: {
                data: toLocalMessageList(data),
                ...records
            }
        })
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '获取失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}