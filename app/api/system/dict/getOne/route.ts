import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { buildResponse } from "@/utils/buildResponse";
import { getOneByIdDict } from "@/db/mongodb/dictCollection";
import { toLocalDict } from "../dataTransform";

export async function POST(request: Request) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        if (!userData) {
            throw new Error('用户数据未找到');
        }
        const body: { id: string } = await request.json()
        const data = await getOneByIdDict(body.id)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '获取成功',
            data: toLocalDict(data)
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '获取失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}