import { checkPermission } from '@/db/mongodb/userCollection';
import { UserWithID } from '@/types/system/user';
import { getRoleAll } from '@/db/mongodb/roleCollection';
import { toLocalRoles } from '../roleDataTrans';
import { getRoleAllPermission } from './permission';
//获取所有角色信息 authCode: ---682d7f74d044808e4bcf0986---
export async function getRoleAllServer(userData?: UserWithID | null) {
    await checkPermission(getRoleAllPermission, userData)
    return toLocalRoles(await getRoleAll());
}