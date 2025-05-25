import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";
import { deleteDictValueSinglePermission } from "../permission";

export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(deleteDictValueSinglePermission, userData)
        const data: { name: string, dictId: string } = await request.json()
        throw new Error('test')
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '删除成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        const message = (error as Error).message || '删除失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 