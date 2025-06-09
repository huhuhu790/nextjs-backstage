import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { deleteOneAuditTestProgrammePermission } from "../permission";
import { deleteOneAuditTestProgramme } from "@/db/mongodb/auditTestProgrammeCollection";
import { deleteFile } from "@/utils/fileOperations";
import { buildResponse } from "@/utils/buildResponse";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(deleteOneAuditTestProgrammePermission, userData)
        const { id } = await request.json();
        const filename = await deleteOneAuditTestProgramme(id, userId)
        await deleteFile(filename);

        return buildResponse({
            status: 200,
            message: '删除成功',
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '删除失败'
        return buildResponse({
            status: 400,
            message
        });
    }
}