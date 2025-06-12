import { getAllMenus, getListByRolesMenus } from '@/db/mongodb/menuCollection'
import { toLocalMenus } from '@/app/api/system/menu/dataTransform';
import { checkPermission } from '@/db/mongodb/userCollection';
import { UserWithID } from '@/types/system/user';
import { getListByPageMenuPermission } from '../permission';
// 需要验证是否登录
export default async function getMenusByRolesServer(userData?: UserWithID | null) {
    if (!userData) throw new Error("无用户信息")
    return toLocalMenus(await getListByRolesMenus(userData.roles));
}


export async function getAllMenusServer(userData: UserWithID) {
    await checkPermission(getListByPageMenuPermission, userData)
    return toLocalMenus(await getAllMenus());
}