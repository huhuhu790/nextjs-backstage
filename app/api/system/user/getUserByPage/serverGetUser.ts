import { UserWithID } from "@/types/system/user"
import { getUserAllPermission } from "../permission"
import { checkPermission, getUserByPage } from "@/db/mongodb/userCollection"
import { toLocalUserList } from "../userDataTrans"

export async function getUserServer(userData?: UserWithID | null) {
    const userId = await checkPermission(getUserAllPermission, userData)
    const { data, ...rest } = await getUserByPage()
    return {
        data: toLocalUserList(data),
        ...rest
    }
} 