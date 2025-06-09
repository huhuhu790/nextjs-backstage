import { getListByPageMessage } from "@/db/mongodb/messageCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { toLocalMessageList } from "../dataTransform";
import { buildResponse } from "@/utils/buildResponse";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        if (!userData || !userData.id) throw new Error('用户未登录')
        const body = await request.json()
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