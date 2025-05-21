import { LocalMenu } from "@/types/api";
import { fetchData } from "@/api/fetchApi";
import { MenuDrawerDataType } from "@/app/dashboard/system/menu/_component/menuPageType";
import { MenuClientDataSendType } from "@/app/api/system/menu/menuClientDataSend";

export async function getMenuAll() {
    return await fetchData<LocalMenu[]>('/api/system/menu/getMenuAll', { showMessage: false })
}

export async function deleteMenu(id: string) {
    return await fetchData<null, { id?: string }>('/api/system/menu/deleteMenu', { body: { id } })
}

export async function addMenu(values: MenuDrawerDataType, parentId: string | null) {
    return await fetchData<null, MenuClientDataSendType>('/api/system/menu/addMenu',
        {
            body: {
                ...values,
                parentId
            }
        })
}

export async function updateMenu(values: MenuDrawerDataType, parentId: string | null) {
    return await fetchData<null, MenuClientDataSendType>('/api/system/menu/updateMenu',
        {
            body: {
                ...values,
                parentId
            }
        })
}
