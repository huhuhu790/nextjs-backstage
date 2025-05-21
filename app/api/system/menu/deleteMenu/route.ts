import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";

//获取所有目录信息 authCode: ---682c35abba576b5b0b059413---
export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        await checkPermission('682c35abba576b5b0b059413', userData)
        const data: { id: string } = await request.json()
        throw new Error("测试")
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '获取成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: '添加目录失败'
        };
        return NextResponse.json(response);
    }
}