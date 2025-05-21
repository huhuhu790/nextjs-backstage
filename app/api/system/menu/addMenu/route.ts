import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { MenuClientDataSendType } from "../menuClientDataSend";

//获取所有目录信息 authCode: ---682c3590ba576b5b0b059412---
export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        await checkPermission('682c3590ba576b5b0b0594121', userData)
        const data: MenuClientDataSendType = await request.json()
        console.log(data);
        
        throw new Error("测试")
        // 成功响应
        const response: ApiResponse = {
            status: 200,
            success: true,
            message: '获取成功'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log((error as Error).message);
        const response: ApiResponse = {
            status: 500,
            success: false,
            message: '添加目录失败'
        };
        return NextResponse.json(response);
    }
}