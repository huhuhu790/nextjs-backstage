import { LocalMenu } from "@/types/api";
import { fetchData } from "@/api/fetchApi";
import { MenuDrawerDataType } from "@/app/dashboard/system/menu/_component/menuPageType";
import { MenuClientDataSendType } from "@/app/api/system/menu/menuClientDataSend";

export async function getMenuAll() {
    return await fetchData<null, LocalMenu>('/api/system/menu/getMenuAll')
}

export async function deleteMenu(values: MenuDrawerDataType, parentId: string | null) {
    return await fetchData<undefined, { id?: string }>('/api/system/menu/deleteMenu', { id: values.id })
}

export async function addMenu(values: MenuDrawerDataType, parentId: string | null) {
    return await fetchData<undefined, MenuClientDataSendType>('/api/system/menu/addMenu', {
        ...values,
        parentId
    })
}

export async function updateMenu(values: MenuDrawerDataType, parentId: string | null) {
    return await fetchData<undefined, MenuClientDataSendType>('/api/system/menu/updateMenu', {
        ...values,
        parentId
    })
}
