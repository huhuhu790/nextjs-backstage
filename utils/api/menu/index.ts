import { LocalUser } from "@/types/api";
import { fetchData } from "@/utils/api/fetchApi";
import { LoginFieldType } from "@/types/login";

export async function handleLogin(values: LoginFieldType) {
    return await fetchData<LocalUser, LoginFieldType>('/api/auth/login', values)
}

export async function handleLogout() {
    return await fetchData('/api/auth/logout')
}