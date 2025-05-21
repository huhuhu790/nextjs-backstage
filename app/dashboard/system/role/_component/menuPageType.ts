import { MenuItemWithID } from "@/types/system/menu";

export type MenuTableDataType = {
    id?: string,
    key: string,
    name: string,
    path: string,
    parentId: string | null,
    iconPath: string,
    type: MenuItemWithID["type"],
    children?: MenuTableDataType[],
}

export type MenuDrawerDataType = {
    id?: string,
    name: string,
    path: string,
    iconPath: string,
    type: MenuTableDataType["type"],
}