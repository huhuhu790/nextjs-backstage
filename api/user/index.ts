import { PaginationResponse } from "@/types/database";
import { fetchData, fetchFormdata } from "../fetchApi";
import { getUserOption, LocalUser } from "@/types/api";

export async function getUserByOption(body: getUserOption) {
    return await fetchData<PaginationResponse<LocalUser[]>, getUserOption>('/api/system/user/getUserByPage', {
        body,
        showMessage: false
    })
}

export async function addUser(formData: FormData) {
    return await fetchFormdata<LocalUser>('/api/system/user/addUserSingle', formData)
}

export async function updateUserSingle(formData: FormData) {
    return await fetchFormdata<LocalUser>('/api/system/user/updateUserSingle', formData)
}

export async function updateUserRoleById(body: { id: string, roleIds: string[] }) {
    return await fetchData<LocalUser, { id: string, roleIds: string[] }>('/api/system/user/updateUserRoleById', {
        body
    })
}

export async function deleteUserSingle(id: string) {
    return await fetchData<LocalUser, { id: string }>('/api/system/user/deleteUserSingle', {
        body: { id }
    })
}

