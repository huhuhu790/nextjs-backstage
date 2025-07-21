import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { buildResponse } from "@/utils/serverUtils";
import { deleteOneDictPermission } from "@/utils/appRoutePermission";
import { deleteOneDict } from "@/db/mongodb/dictCollection";
import { checkProps } from "@/utils/serverUtils";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(deleteOneDictPermission, userData)
        const data: { id: string } = await request.json()
        checkProps(data, ['id'])
        await deleteOneDict(data.id, userId)

        return buildResponse({
            status: 200,
            message: '删除成功'
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '删除字典失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 