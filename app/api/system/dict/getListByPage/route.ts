import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { buildResponse } from "@/utils/buildResponse";
import { getListByPageDictPermission } from "../permission";
import { getListByPageDict } from "@/db/mongodb/dictCollection";
import { toLocalDictList } from "../dataTransform";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(getListByPageDictPermission, userData)
        const body = await request.json()
        const { data, ...records } = await getListByPageDict(body)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '获取成功',
            data: {
                data: toLocalDictList(data),
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