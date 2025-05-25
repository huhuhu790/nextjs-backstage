import { LocalMenu } from "@/types/api";
import { fetchData } from "@/api/fetchApi";


export async function getMenuAll() {
    return await fetchData<LocalMenu[]>('/api/system/menu/getMenuAll', { showMessage: false })
}

export async function deleteMenu(id: string) {
    return await fetchData<null, { id?: string }>('/api/system/menu/deleteMenuSingle', { body: { id } })
}

export async function addMenu(values: LocalMenu, parentId: string | null) {
    return await fetchData<null, LocalMenu>('/api/system/menu/addMenuSingle',
        {
            body: {
                ...values,
                parentId
            }
        })
}

export async function updateMenu(values: LocalMenu, parentId: string | null) {
    return await fetchData<null, LocalMenu>('/api/system/menu/updateMenuSingle',
        {
            body: {
                ...values,
                parentId
            }
        })
}
