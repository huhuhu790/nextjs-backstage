import { getAllMenus, getMenusByRoles } from '@/db/mongodb/menuCollection'
import { toLocalMenus } from '@/app/api/system/menu/menuDataTrans';
import { checkPermission } from '@/db/mongodb/userCollection';
import { UserWithID } from '@/types/system/user';

// 需要验证是否登录
export default async function getMenusByRolesServer(userData?: UserWithID | null) {
    if (!userData) throw new Error("无用户信息")
    return toLocalMenus(await getMenusByRoles(userData.roles));
}

//获取所有目录信息 authCode: ---6826b7e80d62e88cd9215a97---
export async function getAllMenusServer(userData?: UserWithID | null) {
    await checkPermission('6826b7e80d62e88cd9215a97', userData)
    return toLocalMenus(await getAllMenus());
}