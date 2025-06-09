import { getListbyPageAuditTestProgramme } from "@/db/mongodb/auditTestProgrammeCollection"
import { UserWithID } from "@/types/system/user"
import { toLocalAuditTestProgrammeList } from "../dataTransform"
import { checkPermission } from "@/db/mongodb/userCollection"
import { getListbyPageAuditTestProgrammePermission } from '../permission';
const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getAuditTestProgrammeListbyPage(userData?: UserWithID | null) {
    await checkPermission(getListbyPageAuditTestProgrammePermission, userData)
    if (!userData || !userData.id) throw new Error('用户未登录')
    const { data, ...rest } = await getListbyPageAuditTestProgramme({
        pageSize: defaultPageSize,
        currentPage: defaultCurrentPage
    })
    return {
        data: toLocalAuditTestProgrammeList(data),
        ...rest
    }
} 