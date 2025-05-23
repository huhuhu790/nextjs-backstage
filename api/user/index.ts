import { PaginationResponse } from "@/types/database";
import { fetchData } from "../fetchApi";
import { getUserOption, LocalUser } from "@/types/api";

export async function getUserByOption(body: getUserOption) {
    return await fetchData<PaginationResponse<LocalUser[]>, getUserOption>('/api/system/user/getUserByPage', {
        body,
        showMessage: false
    })
}

