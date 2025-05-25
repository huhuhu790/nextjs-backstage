import { WithLocalId } from "@/types/api";
import { DefaultModel } from "@/types/database";

export interface BasicUser {
    username: string;
    password: string;
    name: string;
    workingId: string;
    gender: '男' | '女' | '其他';
    email?: string | null;
    roles: string[];
    avatar?: string | null;
    birthday?: Date | string | null;
    address?: string | null;
    phone: string;
    department?: string[] | null;
}

// 数据库原始用户类型
export interface User extends DefaultModel, BasicUser {
}

export type UserWithID = WithLocalId<User>

// 数据库原始角色类型
export interface Role extends DefaultModel {
    name: string;
    description: string;
    permissions: string[];
    users: string[]
}