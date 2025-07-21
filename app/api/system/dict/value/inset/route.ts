import { checkPermission } from "@/db/mongodb/userCollection";
import { DictValue } from "@/types/system/dictionary";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { insertOneDictValuePermission } from "@/utils/appRoutePermission";
import { insertOneDictValue } from "@/db/mongodb/dictCollection";
import { buildResponse } from "@/utils/serverUtils";
import { checkProps } from "@/utils/serverUtils";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(insertOneDictValuePermission, userData)
        const data: { value: DictValue, dictId: string } = await request.json()
        checkProps(data, ['value', 'dictId']);
        checkProps(data.value, ['name', 'value']);
        await insertOneDictValue(data.value, data.dictId, userId)
        return buildResponse({
            status: 200,
            message: '添加成功'
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '添加失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 