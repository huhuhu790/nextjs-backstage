import { LocalRole } from "@/types/api";
import { RoleItemWithID } from "@/types/system/role";

export function toLocalRole(user: RoleItemWithID): LocalRole {
    return {
        id: user.id,
        name: user.name,
        description: user.description,
        permissions: user.permissions,
        users: user.users,
    }
}

export function toLocalRoles(roles: RoleItemWithID[]): LocalRole[] {
    return roles.map(toLocalRole);
}
