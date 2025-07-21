import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { toLocalRoles } from "../dataTransform";
import { getListByPageRole } from "@/db/mongodb/roleCollection";
import { getListByPageRolePermission } from "@/utils/appRoutePermission";
import { buildResponse } from "@/utils/serverUtils";
import { PaginationRequest } from "@/types/database";
export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        await checkPermission(getListByPageRolePermission, userData)
        const body: Partial<PaginationRequest> = await request.json()
        const { data, ...records } = await getListByPageRole(body)
        // 成功响应
        return buildResponse({
            status: 200,
            message: '获取成功',
            data: {
                data: toLocalRoles(data),
                ...records
            }
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