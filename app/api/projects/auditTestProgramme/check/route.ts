import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { checkAuditTestProgrammePermission } from "../permission";
import { buildResponse } from "@/utils/buildResponse";
import { checkAuditTestProgramme } from "@/db/mongodb/auditTestProgrammeCollection";
import { moveFileFromTmpToTargetPath, moveFileFromOriginToBackupPath } from "@/utils/fileOperations";

export async function POST(request: Request) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(checkAuditTestProgrammePermission, userData)
        const data: { id: string } = await request.json()
        const result = await checkAuditTestProgramme(data.id, userId)

        await moveFileFromOriginToBackupPath(result.originFilePath, result.backupPath, result.originFileName);
        await moveFileFromTmpToTargetPath(result.newFilePath, result.newFileName);

        return buildResponse({ data: result, message: '提交成功', status: 200 });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '提交失败'
        return buildResponse({ message, status: 500 });
    }
}