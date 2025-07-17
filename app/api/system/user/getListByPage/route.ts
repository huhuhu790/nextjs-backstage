import { checkPermission, getListByPageUser } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { getListByPageUserPermission } from "@/utils/appRoutePermission";
import { toLocalUserList } from "../dataTransform";
import { buildResponse } from "@/utils/buildResponse";
import { getUserOption } from "@/types/api";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        await checkPermission(getListByPageUserPermission, userData)
        const body: getUserOption = await request.json()
        const { data, ...records } = await getListByPageUser(body)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '获取成功',
            data: {
                data: toLocalUserList(data),
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