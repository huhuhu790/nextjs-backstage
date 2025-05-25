import { checkPermission } from "@/db/mongodb/userCollection";
import { ApiResponse } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextResponse } from "next/server";
import { addRoleSinglePermission } from "../permission";
import { createRoleSingle } from "@/db/mongodb/roleCollection";
import { LocalRole } from "@/types/api";

export async function POST(request: Request) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(addRoleSinglePermission, userData)
        const data = await request.json()
        const result = await createRoleSingle(data, userId)
        // 成功响应
        const response: ApiResponse<LocalRole> = {
            status: 200,
            success: true,
            message: '添加成功',
            data: {
                id: result.insertedId.toString(),
                name: data.name,
                description: data.description,
                permissions: data.permissions,
                users: data.users,
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.log(error);
        const message = (error as Error).message || '添加角色失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 