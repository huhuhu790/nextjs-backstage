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

