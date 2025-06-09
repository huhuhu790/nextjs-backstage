import { PaginationResponse } from "@/types/database";
import { fetchData, fetchFormdata } from "../../fetchApi";
import { getUserOption, LocalUser } from "@/types/api";
import { sha256 } from "@/utils/encrypt";
import { MessageInstance } from "antd/lib/message/interface";

export async function getUserByOption(body: getUserOption) {
    return await fetchData<PaginationResponse<LocalUser[]>, getUserOption>('/api/system/user/getListByPage', {
        body
    })
}

export async function addUser(formData: FormData, message: MessageInstance) {
    return await fetchFormdata<LocalUser>('/api/system/user/insert', formData, message)
}

export async function updateUserSingle(formData: FormData, message: MessageInstance) {
    return await fetchFormdata<LocalUser>('/api/system/user/update', formData, message)
}

export async function updateUserRoleById(body: { id: string, roleIds: string[] }, message: MessageInstance) {
    return await fetchData<LocalUser, { id: string, roleIds: string[] }>('/api/system/user/updateRoleToUser', {
        body,
        message
    })
}

export async function deleteUserSingle(id: string, message: MessageInstance) {
    return await fetchData<LocalUser, { id: string }>('/api/system/user/delete', {
        body: { id },
        message
    })
}

export async function updateUserOwnData(formData: FormData, message: MessageInstance) {
    return await fetchFormdata<LocalUser>('/api/system/user/updateOwn', formData, message)
}

export async function updateUserOwnPassword(data: {
    originPassword: string,
    newPassword: string,
    id: string
}, message: MessageInstance) {
    return await fetchData<LocalUser, { originPassword: string, newPassword: string, id: string }>('/api/system/user/updatePassword', {
        body: {
            originPassword: await sha256(data.originPassword),
            newPassword: await sha256(data.newPassword),
            id: data.id
        },
        message
    })
}


