import { MenuItemWithID } from "@/types/menu";

export type MenuTableDataType = Pick<MenuItemWithID, "name" | "path" | "iconPath" | "type"> & { children?: MenuTableDataType[], key: string };