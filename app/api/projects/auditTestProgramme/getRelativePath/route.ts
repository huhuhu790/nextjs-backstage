import { checkPermission } from "@/db/mongodb/userCollection"
import { getRelativePathPermission } from '../permission';
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { buildResponse } from "@/utils/buildResponse";
import { GetRelativePathApiProps } from "@/types/projects/auditTestProgramme";
import { checkProps } from "@/utils/checkProps";
import { getRelativePath } from "@/utils/fileOperations";

export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        await checkPermission(getRelativePathPermission, userData)
        const body: GetRelativePathApiProps = await request.json()
        checkProps(body, ['path', 'type'])
        const result = await getRelativePath(body)
        return buildResponse({
            status: 200,
            message: '获取成功',
            data: result
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