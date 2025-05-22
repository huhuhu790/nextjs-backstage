import { checkPermission } from '@/db/mongodb/userCollection';
import { UserWithID } from '@/types/system/user';
import { getRoleByPage } from '@/db/mongodb/roleCollection';
import { toLocalRoles } from '../roleDataTrans';
import { getRoleByPagePermission } from '../permission';

export async function getRoleServer(userData?: UserWithID | null) {
    await checkPermission(getRoleByPagePermission, userData)
    const { data, ...rest } = await getRoleByPage()
    return {
        data: toLocalRoles(data),
        ...rest
    }
};