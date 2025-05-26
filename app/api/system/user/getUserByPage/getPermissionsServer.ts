import { getPermissions } from "@/db/mongodb/userCollection";

export async function getPermissionsServer(roleIds: string[]) {
    const permissions = await getPermissions(roleIds)
    return permissions
}