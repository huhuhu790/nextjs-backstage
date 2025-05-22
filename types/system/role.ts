import { WithLocalId } from "@/types/api";
import { DefaultModel } from "@/types/database";

export interface BasicRole {
    name: string,
    description: string,
    permissions: string[],
    users: string[],
}

// 数据库原始角色类型
export interface RoleItem extends DefaultModel,BasicRole {}

export type RoleItemWithID = WithLocalId<RoleItem>