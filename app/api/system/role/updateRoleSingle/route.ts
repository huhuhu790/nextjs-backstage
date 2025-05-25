import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { updateRoleSinglePermission } from "../permission";
import { updateRoleSingle } from "@/db/mongodb/roleCollection";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(updateRoleSinglePermission, userData)
        const data = await request.json()
        await updateRoleSingle(data, userId)
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '更新成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        const message = (error as Error).message || '更新角色失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 