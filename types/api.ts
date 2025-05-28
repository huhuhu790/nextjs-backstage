import { BasicMenu } from "@/types/system/menu";
import { BasicUser } from "@/types/system/user";
import { BasicRole } from "./system/role";
import { PaginationRequest } from "./database";
import { BasicDict, DictValue } from "./system/dictionary";
import { BasicMessage } from "./system/message";
export interface ApiResponse<T = undefined> {
    data?: T;
    status: number;
    success: boolean;
    message?: string;
}

export type WithLocalId<T> = T & { id: string };

export type OptionalLocalId<T> = T & { id?: string };

// 本地用户类型
export type LocalUser = OptionalLocalId<Omit<BasicUser, "password">>;

// 本地菜单类型
export type LocalMenu = OptionalLocalId<BasicMenu>;

export type LocalRole = OptionalLocalId<BasicRole>;

export type LoginFieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

export interface getUserOption extends PaginationRequest {
    roleId?: string;
    unselected?: boolean;
}

export type updateUserDataType = LocalUser & {
    file?: File | null;
}

export type LocalDict = OptionalLocalId<BasicDict>;

export type updateDictValueDataType = {
    id: string,
    values: DictValue[]
}

export type LocalMessage = OptionalLocalId<BasicMessage>