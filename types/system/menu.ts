import { WithLocalId } from "@/types/api";
import { DefaultModel } from "@/types/database";

export interface BasicMenu {
    parentId: string | null;
    name: string;
    path: string;
    iconPath: string;
    type: "folder" | "menu" | "button";
    children?: string[];
}

// 数据库原始菜单类型
export interface MenuItem extends DefaultModel,BasicMenu {}

export type MenuItemWithID = WithLocalId<MenuItem>