import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalDict } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { buildResponse } from "@/utils/buildResponse";
import { NextRequest, NextResponse } from "next/server";
import { insertOneDictPermission } from "../permission";
import { insertOneDict } from "@/db/mongodb/dictCollection";
import { checkProps } from "@/utils/checkProps";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(insertOneDictPermission, userData)
        const data: LocalDict = await request.json()
        checkProps(data, ['name', 'description', 'values']);
        const result = await insertOneDict(data, userId)
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
        return buildResponse({
            status: 400,
            message
        });
    }
} 