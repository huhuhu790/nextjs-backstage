import { deleteSingleMenu } from "@/db/mongodb/menuCollection";
import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";

//获取所有目录信息 authCode: ---682c35abba576b5b0b059413---
export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission('682c35abba576b5b0b059413', userData)
        const data: { id?: string } = await request.json()
        if (!data.id) throw new Error("目录id无效")
        await deleteSingleMenu(data.id, userId)
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '删除成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log((error as Error).message);
        const message = (error as Error).message || '删除目录失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
}