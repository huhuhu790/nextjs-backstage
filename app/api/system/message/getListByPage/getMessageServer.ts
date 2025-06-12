import { getListByPageMessage } from "@/db/mongodb/messageCollection"
import { UserWithID } from "@/types/system/user"
import { toLocalMessageList } from "../dataTransform"

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getMessageServer(userData?: UserWithID | null) {
    if (!userData || !userData.id) throw new Error('用户未登录')
    const { data, total } = await getListByPageMessage(userData, {
        pageSize: defaultPageSize,
        currentPage: defaultCurrentPage
    })
    return {
        data: toLocalMessageList(data),
        total,
        pageSize: defaultPageSize,
        currentPage: defaultCurrentPage
    }
} 