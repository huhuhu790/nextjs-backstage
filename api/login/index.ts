import { LocalUser, LoginFieldType } from "@/types/api";
import { fetchData } from "@/api/fetchApi";

export async function handleLogin(values: LoginFieldType) {
    return await fetchData<LocalUser, LoginFieldType>('/api/auth/login', { body: values })
}

export async function handleLogout() {
    return await fetchData('/api/auth/logout')
}