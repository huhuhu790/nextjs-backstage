import { updateUserOwnData } from "@/db/mongodb/userCollection";
import { ApiResponse, LocalUser, updateUserDataType } from "@/types/api";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const userData = await getHeadUserData()
        if (!userData) throw new Error('请先登录')
        const formData = await request.formData()
        const department = formData.get('department') as string
        const id = formData.get('id') as string
        if (id !== userData.id) throw new Error('无权限操作')
        const data: Partial<updateUserDataType> = {
            id: formData.get('id') as string,
            name: formData.get('name') as string,
            gender: formData.get('gender') as LocalUser["gender"],
            phone: formData.get('phone') as string,
            email: formData.get('email') as string || null,
            address: formData.get('address') as string || null,
            birthday: formData.get('birthday') as string || null,
            avatar: formData.get('avatar') as string || null,
            file: formData.get('file') as File || null,
        }
        const result = await updateUserOwnData(data, userData.id)
        // 成功响应
        const response: ApiResponse<LocalUser> = {
            status: 200,
            success: true,
            message: '更新成功',
            data: {
                id: data.id!,
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
        const message = (error as Error).message || '更新失败'
        const response: ApiResponse = {
            status: 500,
            success: false,
            message
        };
        return NextResponse.json(response);
    }
} 