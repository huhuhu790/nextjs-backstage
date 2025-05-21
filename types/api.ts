import { MenuItem } from "@/types/system/menu";
import { User } from "@/types/system/user";
import { RoleItem } from "./system/role";

export interface ApiResponse<T = any> {
    data?: T;
    status: number;
    success: boolean;
    message?: string;
}

export type WithLocalId<T> = T & { id: string };

// 本地用户类型
export type LocalUser = WithLocalId<Pick<
    User,
    'username' |
    'name' |
    'workingId' |
    'gender' |
    'email' |
    'roles' |
    'avatar' |
    'birthday' |
    'address' |
    'phone' |
    'department'
>>;

// 本地菜单类型
export type LocalMenu = WithLocalId<Pick<
    MenuItem,
    'parentId' |
    'name' |
    'path' |
    'iconPath' |
    'type' |
    'children'
>>;

export type LocalRole = WithLocalId<Pick<
    RoleItem,
    'name' |
    'description' |
    'permissions' |
    'users'
>>;
