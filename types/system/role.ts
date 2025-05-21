import { WithLocalId } from "@/types/api";
import { DefaultModel } from "@/types/database";

// 数据库原始角色类型
export interface RoleItem extends DefaultModel {
    name: string,
    description: string | null,
    permissions: string[],
    users: string[],
}

export type RoleItemWithID = WithLocalId<RoleItem>