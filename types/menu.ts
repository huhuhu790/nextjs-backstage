import { WithLocalId } from "./api";
import { DefaultModel } from "./database";

export interface MenuItem  extends DefaultModel{
    parentId: string | null;
    name: string;
    path: string;
    iconPath: string;
    type: "folder" | "menu" | "button";
    children?: string[];
}

export type MenuItemWithID = WithLocalId<MenuItem>