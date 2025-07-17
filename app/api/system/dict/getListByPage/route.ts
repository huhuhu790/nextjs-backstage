import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { buildResponse } from "@/utils/buildResponse";
import { getListByPageDictPermission } from "@/utils/appRoutePermission";
import { getListByPageDict } from "@/db/mongodb/dictCollection";
import { toLocalDictList } from "../dataTransform";
import { checkProps } from "@/utils/checkProps";
import { PaginationRequest } from "@/types/database";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        await checkPermission(getListByPageDictPermission, userData)
        const body: PaginationRequest = await request.json()
        checkProps(body, ['currentPage', 'pageSize']);
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