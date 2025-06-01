import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { DictValue } from "@/types/system/dictionary";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";
import { addDictValueSinglePermission } from "../permission";
import { addDictValueSingle } from "@/db/mongodb/dictCollection";

export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(addDictValueSinglePermission, userData)
        const data: { value: DictValue, dictId: string } = await request.json()
        const dict = await addDictValueSingle(data.value, data.dictId, userId)
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '添加成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '添加失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 