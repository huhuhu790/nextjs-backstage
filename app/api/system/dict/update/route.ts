import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalDict } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { updateOneDictPermission } from "@/utils/appRoutePermission";
import { updateOneDict } from "@/db/mongodb/dictCollection";
import { buildResponse } from "@/utils/buildResponse";
import { checkProps } from "@/utils/checkProps";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(updateOneDictPermission, userData)
        const data: LocalDict = await request.json()
        checkProps(data, ['id', 'name']);
        await updateOneDict(data, userId)

        return buildResponse({
            status: 200,
            message: '更新成功'
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '更新字典失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 