import { LocalUser } from "@/types/api";
import { fetchData } from "@/api/fetchApi";
import { LoginFieldType } from "@/app/login/loginType";

export async function handleLogin(values: LoginFieldType) {
    return await fetchData<LocalUser, LoginFieldType>('/api/auth/login', { body: values })
}

export async function handleLogout() {
    return await fetchData('/api/auth/logout')
}