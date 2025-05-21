import { WithLocalId } from "@/types/api";
import { DefaultModel } from "@/types/database";

// 数据库原始菜单类型
export interface MenuItem extends DefaultModel {
    parentId: string | null;
    name: string;
    path: string;
    iconPath: string;
    type: "folder" | "menu" | "button";
    children?: string[];
}

export type MenuItemWithID = WithLocalId<MenuItem>