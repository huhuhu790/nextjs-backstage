import { User } from "./user";

export interface ApiResponse<T = any> {
    data?: T;
    status: number;
    success: boolean;
    message?: string;
}

export type WithLocalId<T> = T & { id: string };

export type LocalUser = WithLocalId<Omit<User, 'password'>>;