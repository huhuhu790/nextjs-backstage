import { WithLocalId } from "./api";
import { DefaultModel } from "./database";

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

export interface Role extends DefaultModel {
    name: string;
    description: string;
    permissions: string[];
    users: string[]
}