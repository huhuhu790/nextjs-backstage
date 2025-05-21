import { WithLocalId } from "@/types/api";
import { DefaultModel } from "@/types/database";

// 数据库原始用户类型
export interface User extends DefaultModel {
    username: string;
    password: string;
    name: string;
    workingId: string;
    gender: 'male' | 'female';
    email: string;
    roles: string[];
    avatar: string;
    birthday: Date;
    address: string;
    phone: string;
    department: string[];
}

export type UserWithID = WithLocalId<User>

// 数据库原始角色类型
export interface Role extends DefaultModel {
    name: string;
    description: string;
    permissions: string[];
    users: string[]
}