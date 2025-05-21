import { LocalMenu } from "@/types/api";
import { MenuItemWithID } from "@/types/system/menu";

export function toLocalMenu(user: MenuItemWithID): LocalMenu {
    return {
        id: user.id,
        parentId: user.parentId,
        name: user.name,
        path: user.path,
        iconPath: user.iconPath,
        type: user.type,
        children: user.children
    }
}

export function toLocalMenus(menus: MenuItemWithID[]): LocalMenu[] {
    return menus.map(toLocalMenu);
}
