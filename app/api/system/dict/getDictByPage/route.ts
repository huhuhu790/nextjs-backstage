import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalDict } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { getDictAllPermission } from "../permission";
import { getDictByPage } from "@/db/mongodb/dictCollection";
import { toLocalDictList } from "../dictDataTrans";
import { PaginationResponse } from "@/types/database";
export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(getDictAllPermission, userData)
        const body = await request.json()
        const { data, ...records } = await getDictByPage(body)
        // 成功响应
        const response: ApiResponse<PaginationResponse<LocalDict[]>> = {
            status: 200,
            success: true,
            message: '获取成功',
            data: {
                data: toLocalDictList(data),
                ...records
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        const message = (error as Error).message || '获取失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
}