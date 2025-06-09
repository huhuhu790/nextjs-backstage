import { checkPermission } from "@/db/mongodb/userCollection"
import { getListByPageDictPermission } from "../permission"
import { getListByPageDict } from "@/db/mongodb/dictCollection"
import { UserWithID } from "@/types/system/user"
import { toLocalDictList } from "../dataTransform"

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getDictServer(userData: UserWithID | null) {
    await checkPermission(getListByPageDictPermission, userData)
    const { data, ...records } = await getListByPageDict({
        pageSize: defaultPageSize,
        currentPage: defaultCurrentPage
    })
    return {
        data: toLocalDictList(data),
        ...records
    }
} 