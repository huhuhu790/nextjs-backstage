import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { updateSingleMenu } from "@/db/mongodb/menuCollection";
import { updateMenuSinglePermission } from "../permission";
import { MenuDataBasic } from "@/app/dashboard/system/menu/_component/menuPageType";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(updateMenuSinglePermission, userData)
        const data: Partial<MenuDataBasic> = await request.json()
        const result = await updateSingleMenu(data, userId)
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '更新成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log((error as Error).message);
        const message = (error as Error).message || '更新目录失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
}