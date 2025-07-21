import { checkPermission } from "@/db/mongodb/userCollection";
import { DictValue } from "@/types/system/dictionary";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { updateOneDictValuePermission } from "@/utils/appRoutePermission";
import { updateOneDictValue } from "@/db/mongodb/dictCollection";
import { buildResponse } from "@/utils/serverUtils";
import { checkProps } from "@/utils/serverUtils";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(updateOneDictValuePermission, userData)
        const data: { value: DictValue, dictId: string } = await request.json()
        checkProps(data, ['value', 'dictId']);
        checkProps(data.value, ['_id', 'name', 'value']);
        await updateOneDictValue(data.value, data.dictId, userId)
        return buildResponse({
            status: 200,
            message: '更新成功',
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '更新失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 