import { checkPermission, getUserByPage } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalUser } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { getUserAllPermission } from "../permission";
import { toLocalUserList } from "../userDataTrans";
import { PaginationResponse } from "@/types/database";
export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(getUserAllPermission, userData)
        const body = await request.json()
        const { data, ...records } = await getUserByPage(body)
        // 成功响应
        const response: ApiResponse<PaginationResponse<LocalUser[]>> = {
            status: 200,
            success: true,
            message: '获取成功',
            data: {
                data: toLocalUserList(data),
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