import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { buildResponse } from "@/utils/serverUtils";
import { getOneByIdDict } from "@/db/mongodb/dictCollection";
import { toLocalDict } from "../dataTransform";
import { checkProps } from "@/utils/serverUtils";

export async function POST(request: Request) {
    try {
        const headersList = await headers()
        await getHeadUserData(headersList);
        const body: { id: string } = await request.json()
        checkProps(body, ['id']);
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