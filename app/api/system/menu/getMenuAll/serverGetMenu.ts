import { getAllMenus, getMenusByRoles } from '@/db/mongodb/menuCollection'
import { toLocalMenus } from '@/app/api/system/menu/menuDataTrans';
import { checkPermission } from '@/db/mongodb/userCollection';
import { UserWithID } from '@/types/system/user';
import { getMenuAllPermission } from '../permission';
// 需要验证是否登录
export default async function getMenusByRolesServer(userData?: UserWithID | null) {
    if (!userData) throw new Error("无用户信息")
    return toLocalMenus(await getMenusByRoles(userData.roles));
}


export async function getAllMenusServer(userData?: UserWithID | null) {
    await checkPermission(getMenuAllPermission, userData)
    return toLocalMenus(await getAllMenus());
}