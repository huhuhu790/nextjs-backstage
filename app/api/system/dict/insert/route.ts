import { checkPermission } from "@/db/mongodb/userCollection";
import { LocalDict } from "@/types/api";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { buildResponse } from "@/utils/serverUtils";
import { NextRequest } from "next/server";
import { insertOneDictPermission } from "@/utils/appRoutePermission";
import { insertOneDict } from "@/db/mongodb/dictCollection";
import { checkProps } from "@/utils/serverUtils";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        const userId = await checkPermission(insertOneDictPermission, userData)
        const data: LocalDict = await request.json()
        checkProps(data, ['name']);
        const result = await insertOneDict(data, userId)

        return buildResponse({
            status: 200,
            message: '添加成功',
            data: {
                id: result.insertedId.toString(),
                name: data.name!,
                description: data.description!,
                values: data.values!,
            }
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '添加字典失败'
        return buildResponse({
            status: 400,
            message
        });
    }
} 