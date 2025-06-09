import { getListbyPageAuditTestProgramme } from "@/db/mongodb/auditTestProgrammeCollection"
import { toLocalAuditTestProgrammeList } from "../dataTransform"
import { checkPermission } from "@/db/mongodb/userCollection"
import { getListbyPageAuditTestProgrammePermission } from '../permission';
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { buildResponse } from "@/utils/buildResponse";

export async function POST(request: Request) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        await checkPermission(getListbyPageAuditTestProgrammePermission, userData)
        const body = await request.json()
        const { data, ...records } = await getListbyPageAuditTestProgramme(body)

        return buildResponse({
            status: 200,
            message: '获取成功',
            data: {
                data: toLocalAuditTestProgrammeList(data),
                ...records
            }
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '获取失败'
        return buildResponse({
            status: 401,
            message
        });
    }
}