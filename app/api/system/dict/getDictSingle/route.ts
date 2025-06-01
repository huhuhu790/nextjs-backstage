import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalDict } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { getDictAllPermission } from "../permission";
import { getDictSingleById } from "@/db/mongodb/dictCollection";
import { toLocalDict } from "../dictDataTrans";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(getDictAllPermission, userData)
        const body: { id: string } = await request.json()
        const data = await getDictSingleById(body.id)
        // 成功响应
        const response: ApiResponse<LocalDict> = {
            status: 200,
            success: true,
            message: '获取成功',
            data: toLocalDict(data)
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '获取失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
}