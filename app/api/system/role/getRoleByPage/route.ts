import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { toLocalRoles } from "../roleDataTrans";
import { getRoleByPage } from "@/db/mongodb/roleCollection";
import { getRoleByPagePermission } from "../permission";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(getRoleByPagePermission, userData)
        const body = await request.json()
        const { data, ...records } = await getRoleByPage(body)
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '获取成功',
            data: {
                data: toLocalRoles(data),
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