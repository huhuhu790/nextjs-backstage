import { checkPermission } from '@/db/mongodb/userCollection';
import { UserWithID } from '@/types/system/user';
import { getRoleByPage } from '@/db/mongodb/roleCollection';
import { toLocalRoles } from '../roleDataTrans';
import { getRoleByPagePermission } from '../permission';

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getRoleServer(userData?: UserWithID | null) {
    await checkPermission(getRoleByPagePermission, userData)
    const { data, ...rest } = await getRoleByPage({
        pageSize: defaultPageSize,
        currentPage: defaultCurrentPage
    })
    return {
        data: toLocalRoles(data),
        ...rest
    }
};