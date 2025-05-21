import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";

//获取所有目录信息 authCode: ---6826b7e80d62e88cd9215a97---
export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        await checkPermission('6826b7e80d62e88cd9215a97', userData)
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