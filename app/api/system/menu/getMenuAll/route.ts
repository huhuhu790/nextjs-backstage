import { getAllMenus } from "@/db/mongodb/menuCollection";
import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { toLocalMenus } from "../menuDataTrans";

//获取所有目录信息 authCode: ---6826b7e80d62e88cd9215a97---
export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission('6826b7e80d62e88cd9215a97', userData)
        const data = toLocalMenus(await getAllMenus())
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '获取成功',
            data
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