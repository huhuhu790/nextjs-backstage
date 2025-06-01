import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalDict } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";
import { updateDictSinglePermission } from "../permission";
import { updateDictSingle } from "@/db/mongodb/dictCollection";

export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(updateDictSinglePermission, userData)
        const data: Partial<LocalDict> = await request.json()
        const result = await updateDictSingle(data, userId)
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '更新成功',
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '更新字典失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 