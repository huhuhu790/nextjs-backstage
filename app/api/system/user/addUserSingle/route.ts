import { checkPermission, createUserSingle } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalUser, updateUserDataType } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";
import { addUserSinglePermission } from "../permission";

export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        const userId = await checkPermission(addUserSinglePermission, userData)
        const formData = await request.formData()
        const department = formData.get('department') as string
        const data: Partial<updateUserDataType> = {
            username: formData.get('username') as string,
            name: formData.get('name') as string,
            workingId: formData.get('workingId') as string,
            gender: formData.get('gender') as LocalUser["gender"],
            phone: formData.get('phone') as string,
            email: formData.get('email') as string || null,
            address: formData.get('address') as string || null,
            department: department ? department.split(',') : [],
            birthday: formData.get('birthday') as string || null,
            avatar: formData.get('avatar') as string || null,
            file: formData.get('file') as File || null,
        }
        const result = await createUserSingle(data, userId)
        // 成功响应
        const response: ApiResponse<LocalUser> = {
            status: 200,
            success: true,
            message: '添加成功',
            data: {
                id: result.insertedId.toString(),
                username: data.username!,
                name: data.name!,
                workingId: data.workingId!,
                gender: data.gender!,
                phone: data.phone!,
                email: data.email!,
                avatar: data.avatar!,
                birthday: data.birthday!,
                address: data.address!,
                department: data.department!,
                roles: data.roles!
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '添加用户失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 