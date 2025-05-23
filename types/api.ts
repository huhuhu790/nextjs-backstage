import { BasicMenu } from "@/types/system/menu";
import { BasicUser } from "@/types/system/user";
import { BasicRole } from "./system/role";
import { PaginationRequest } from "./database";

export interface ApiResponse<T = any> {
    data?: T;
    status: number;
    success: boolean;
    message?: string;
}

export type WithLocalId<T> = T & { id: string };

export type OptionalLocalId<T> = T & { id?: string };

// 本地用户类型
export type LocalUser = WithLocalId<Omit<BasicUser, "password">>;

// 本地菜单类型
export type LocalMenu = WithLocalId<BasicMenu>;

export type LocalRole = WithLocalId<BasicRole>;

export type LoginFieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

export interface getUserOption extends PaginationRequest {
    roleId?: string;
    unselected?: boolean;
}