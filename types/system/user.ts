import { WithLocalId } from "@/types/api";
import { DefaultModel } from "@/types/database";

export interface BasicUser {
    username: string;
    password: string;
    name: string;
    workingId: string;
    gender: '男' | '女';
    email: string;
    roles: string[];
    avatar: string;
    birthday: Date;
    address: string;
    phone: string;
    department: string[];
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