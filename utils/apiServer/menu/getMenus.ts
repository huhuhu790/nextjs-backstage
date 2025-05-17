import { getAllMenus, getMenusByRoles } from '@/db/mongodb/menuCollection'
export default async function getMenusByRolesServer(roleIds: string[]) {
    return await getMenusByRoles(roleIds);
}

export async function getAllMenusServer(roleIds: string[]) {
    return await getAllMenus(roleIds);
}