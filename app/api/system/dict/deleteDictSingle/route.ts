import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";
import { deleteDictSinglePermission } from "../permission";
import { deleteDictSingle } from "@/db/mongodb/dictCollection";

export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(deleteDictSinglePermission, userData)
        const data: { id: string } = await request.json()
        const result = await deleteDictSingle(data.id, userId)
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '删除成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '删除字典失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 