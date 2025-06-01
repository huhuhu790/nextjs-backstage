import { checkPermission, deleteUserSingle } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalUser } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";
import { deleteUserSinglePermission } from "../permission";

export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(deleteUserSinglePermission, userData)
        const body = await request.json()
        const result = await deleteUserSingle(body.id, userId)
        // 成功响应
        const response: ApiResponse<LocalUser> = {
            status: 200,
            success: true,
            message: '删除成功',
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '删除用户失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 