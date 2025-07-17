import { LocalUser, LoginFieldType } from "@/types/api";
import { fetchData } from "@/api/fetchApi";
import { MessageInstance } from "antd/lib/message/interface";

export async function handleLogin(values: LoginFieldType, message: MessageInstance) {
    return await fetchData<{ userInfo: LocalUser, permission: string[] }, LoginFieldType>('/api/auth/login', { body: values, message })
}

export async function handleLogout(message: MessageInstance) {
    return await fetchData('/api/auth/logout', {
        message,
        body:{}
    })
}