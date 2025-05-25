import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { DictValue } from "@/types/system/dictionary";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";
import { updateDictValueSinglePermission } from "../permission";

export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(updateDictValueSinglePermission, userData)
        const data: { value: DictValue, dictId: string } = await request.json()
        throw new Error('test')
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '更新成功',
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        const message = (error as Error).message || '更新失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 