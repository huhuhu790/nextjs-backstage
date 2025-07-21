import { checkPermission, insertOneUser } from "@/db/mongodb/userCollection";
import { LocalUser, updateUserDataType } from "@/types/api";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { insertOneUserPermission } from "@/utils/appRoutePermission";
import { buildResponse } from "@/utils/serverUtils";
import { checkProps } from "@/utils/serverUtils";
export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(insertOneUserPermission, userData)
        const formData = await request.formData()
        const department = formData.get('department') as string
        const data: updateUserDataType = {
            username: formData.get('username') as string,
            name: formData.get('name') as string,
            workingId: formData.get('workingId') as string,
            gender: formData.get('gender') as LocalUser["gender"],
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            address: formData.get('address') as string || null,
            department: department ? department.split(',') : [],
            birthday: formData.get('birthday') as string || null,
            avatar: formData.get('avatar') as string || null,
            file: formData.get('file') as File || null,
            roles: []
        }
        checkProps(data, [
            'username',
            'name',
            'workingId',
            'gender',
            'phone',
            'email',
        ])
        const result = await insertOneUser(data, userId)
        // 成功响应
        return buildResponse({
            status: 200,
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
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '添加用户失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 