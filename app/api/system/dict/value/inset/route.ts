import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { DictValue } from "@/types/system/dictionary";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { insertOneDictValuePermission } from "../../permission";
import { insertOneDictValue } from "@/db/mongodb/dictCollection";
import { buildResponse } from "@/utils/buildResponse";
import { checkProps } from "@/utils/checkProps";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(insertOneDictValuePermission, userData)
        const data: { value: DictValue, dictId: string } = await request.json()
        checkProps(data, ['value', 'dictId']);
        checkProps(data.value, ['name', 'value']);
        await insertOneDictValue(data.value, data.dictId, userId)
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
        return buildResponse({
            status: 400,
            message
        });
    }
} 