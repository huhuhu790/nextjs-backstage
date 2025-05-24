import { checkPermission, getUserByPage } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { getDictAllPermission } from "../permission";
import { getDictByPage } from "@/db/mongodb/dictCollection";
import { toLocalDictList } from "../dictDataTrans";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(getDictAllPermission, userData)
        const body = await request.json()
        const { data, ...records } = await getDictByPage(body)
        // 成功响应
        const response: ApiResponse = {
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
        console.log((error as Error).message);
        const message = (error as Error).message || '获取失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
}