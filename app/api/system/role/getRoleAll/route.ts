import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { getRoleAllPermission } from "./permission";
//获取所有目录信息 authCode: ---682d7f74d044808e4bcf0986---
export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(getRoleAllPermission, userData)
        throw new Error("获取失败")
        // const data = toLocalMenus(await getAllMenus())
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '获取成功',
            // data
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