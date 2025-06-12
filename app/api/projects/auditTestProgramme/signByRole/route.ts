import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { signByRoleAuditTestProgrammePermission } from "../permission";
import { buildResponse } from "@/utils/buildResponse";
import { signByRoleAuditTestProgramme } from "@/db/mongodb/auditTestProgrammeCollection";
import { AuditTestProgrammeRoles } from "@/types/projects/auditTestProgramme";
import { checkProps } from "@/utils/checkProps";

export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        await checkPermission(signByRoleAuditTestProgrammePermission, userData)
        const data: { id: string, roleName: AuditTestProgrammeRoles } = await request.json()
        checkProps(data, ['id', 'roleName']);
        const result = await signByRoleAuditTestProgramme(data, userData!)
        return buildResponse({ data: result, message: data.roleName + '审核成功', status: 200 });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '审核失败'
        return buildResponse({ message, status: 400 });
    }
}