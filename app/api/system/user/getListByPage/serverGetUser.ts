import { UserWithID } from "@/types/system/user"
import { getListByPageUserPermission } from "../permission"
import { checkPermission, getListByPageUser } from "@/db/mongodb/userCollection"
import { toLocalUserList } from "../dataTransform"

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getUserServer(userData: UserWithID) {
    await checkPermission(getListByPageUserPermission, userData)
    const { data, total } = await getListByPageUser({
        pageSize: defaultPageSize,
        currentPage: defaultCurrentPage
    })
    return {
        data: toLocalUserList(data),
        total,
        pageSize: defaultPageSize,
        currentPage: defaultCurrentPage
    }
} 