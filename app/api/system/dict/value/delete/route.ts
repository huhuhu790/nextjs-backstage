import { checkPermission } from "@/db/mongodb/userCollection";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { deleteOneDictValuePermission } from "@/utils/appRoutePermission";
import { deleteOneDictValue } from "@/db/mongodb/dictCollection";
import { buildResponse } from "@/utils/buildResponse";
import { checkProps } from "@/utils/checkProps";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(deleteOneDictValuePermission, userData)
        const data: { valueId: string, dictId: string } = await request.json()
        checkProps(data, ['valueId', 'dictId']);
        await deleteOneDictValue(data.valueId, data.dictId, userId)

        return buildResponse({
            status: 200,
            message: '删除成功'
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