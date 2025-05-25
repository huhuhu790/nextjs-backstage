import { getAllMenus } from "@/db/mongodb/menuCollection";
import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalMenu } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { toLocalMenus } from "../menuDataTrans";
import { getMenuAllPermission } from "../permission";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(getMenuAllPermission, userData)
        const data = toLocalMenus(await getAllMenus())
        // 成功响应
        const response: ApiResponse<LocalMenu[]> = {
            status: 200,
            success: true,
            message: '获取成功',
            data
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