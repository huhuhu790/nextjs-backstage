import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalMenu } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { updateSingleMenu } from "@/db/mongodb/menuCollection";
import { updateMenuSinglePermission } from "../permission";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(updateMenuSinglePermission, userData)
        const data: Partial<LocalMenu> = await request.json()
        const result = await updateSingleMenu(data, userId)
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '更新成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '更新目录失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
}