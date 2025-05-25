import { checkPermission } from "@/db/mongodb/userCollection"
import { getDictAllPermission } from "../permission"
import { getDictByPage } from "@/db/mongodb/dictCollection"
import { UserWithID } from "@/types/system/user"
import { toLocalDictList } from "../dictDataTrans"

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getDictServer(userData: UserWithID | null) {
    const userId = await checkPermission(getDictAllPermission, userData)
    const { data, ...records } = await getDictByPage({
        pageSize: defaultPageSize,
        currentPage: defaultCurrentPage
    })
    return {
        data: toLocalDictList(data),
        ...records
    }
} 