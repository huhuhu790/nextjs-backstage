import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalDict } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";
import { addDictSinglePermission } from "../permission";
import { createDictSingle } from "@/db/mongodb/dictCollection";

export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(addDictSinglePermission, userData)
        const data: Partial<LocalDict> = await request.json()
        const result = await createDictSingle(data, userId)
        // 成功响应
        const response: ApiResponse<LocalDict> = {
            status: 200,
            success: true,
            message: '添加成功',
            data: {
                id: result.insertedId.toString(),
                name: data.name!,
                description: data.description!,
                values: data.values!,
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '添加字典失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 