import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";
import { deleteDictValueSinglePermission } from "../permission";
import { deleteDictValueSingle } from "@/db/mongodb/dictCollection";
export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(deleteDictValueSinglePermission, userData)
        const data: { valueId: string, dictId: string } = await request.json()
        const dict = await deleteDictValueSingle(data.valueId, data.dictId, userId)
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '删除成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '删除失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 