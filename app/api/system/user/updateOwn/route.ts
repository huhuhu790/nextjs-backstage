import { updateOwn } from "@/db/mongodb/userCollection";
import { LocalUser, updateUserDataType } from "@/types/api";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { buildResponse } from "@/utils/serverUtils";
import { checkProps } from "@/utils/serverUtils";
export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        if (!userData) throw new Error('请先登录')
        const formData = await request.formData()
        const id = formData.get('id') as string
        if (id !== userData.id) throw new Error('无权限操作')
        const data: updateUserDataType = {
            id: formData.get('id') as string,
            name: formData.get('name') as string,
            gender: formData.get('gender') as LocalUser["gender"],
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            address: formData.get('address') as string || null,
            birthday: formData.get('birthday') as string || null,
            avatar: formData.get('avatar') as string || null,
            file: formData.get('file') as File || null,
            roles: [],
            username: "", workingId: ""
        }
        checkProps(data, [
            'id',
            'name',
            'gender',
            'phone',
            'email',
        ])
        await updateOwn(data, userData.id)
        // 成功响应
        return buildResponse({
            status: 200,
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
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '更新失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 