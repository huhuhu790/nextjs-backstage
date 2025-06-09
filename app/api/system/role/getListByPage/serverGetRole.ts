import { checkPermission } from '@/db/mongodb/userCollection';
import { UserWithID } from '@/types/system/user';
import { getListByPageRole } from '@/db/mongodb/roleCollection';
import { toLocalRoles } from '../dataTransform';
import { getListByPageRolePermission } from '../permission';

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getRoleServer(userData?: UserWithID | null) {
    await checkPermission(getListByPageRolePermission, userData)
    const { data, ...rest } = await getListByPageRole({
        pageSize: defaultPageSize,
        currentPage: defaultCurrentPage
    })
    return {
        data: toLocalRoles(data),
        ...rest
    }
};