import { getAllMenus } from "@/db/mongodb/menuCollection";
import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { toLocalMenus } from "../dataTransform";
import { getListByPageMenuPermission } from "../permission";
import { buildResponse } from "@/utils/buildResponse";

export async function POST() {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        await checkPermission(getListByPageMenuPermission, userData)
        const data = toLocalMenus(await getAllMenus())
        // 成功响应
        return buildResponse({
            status: 200,
            message: '获取成功',
            data
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