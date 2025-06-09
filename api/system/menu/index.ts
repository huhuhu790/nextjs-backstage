import { LocalMenu } from "@/types/api";
import { fetchData } from "@/api/fetchApi";
import { MessageInstance } from "antd/lib/message/interface";


export async function getMenuAll() {
    return await fetchData<LocalMenu[]>('/api/system/menu/getListByPage')
}

export async function deleteMenu(id: string, message: MessageInstance) {
    return await fetchData<null, { id?: string }>('/api/system/menu/delete', { body: { id }, message })
}

export async function addMenu(values: LocalMenu, parentId: string | null, message: MessageInstance) {
    return await fetchData<null, LocalMenu>('/api/system/menu/insert',
        {
            body: {
                ...values,
                parentId
            }, message
        })
}

export async function updateMenu(values: LocalMenu, parentId: string | null, message: MessageInstance) {
    return await fetchData<null, LocalMenu>('/api/system/menu/update',
        {
            body: {
                ...values,
                parentId
            }, message
        })
}
