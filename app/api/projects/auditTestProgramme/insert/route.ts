import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { insertOneAuditTestProgrammePermission } from "../permission";
import { LocalAuditTestProgramme } from "@/types/projects/auditTestProgramme";
import { insertOneAuditTestProgramme } from "@/db/mongodb/auditTestProgrammeCollection";
import { buildResponse } from "@/utils/buildResponse";
import { checkFileExists, checkFileExistsOrigin, deleteFile } from "@/utils/fileOperations";
import { checkProps } from "@/utils/checkProps";
import { join } from "path";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(insertOneAuditTestProgrammePermission, userData)
        const data: LocalAuditTestProgramme = await request.json()
        checkProps(data, ['newFileName', 'originFileName', 'originFilePath', 'newFilePath', 'backupPath', 'name']);
        try {
            checkFileExistsOrigin(join(data.originFilePath, data.originFileName));
            checkFileExists(data.newFileName);
            await insertOneAuditTestProgramme(data, userId)
        } catch (error) {
            await deleteFile(data.newFileName);
            throw error;
        }
        return buildResponse({
            status: 200,
            message: '添加成功',
        })
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '添加失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}