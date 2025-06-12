import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { downloadFile } from "@/db/mongodb/gridFSCollection";
import { checkProps } from "@/utils/checkProps";

export async function POST(request: NextRequest) {
    try {
        const headersList = await headers()
        await getHeadUserData(headersList)
        const body: { fileId: string } = await request.json()
        checkProps(body, ['fileId'])
        const result = await downloadFile(body.fileId)
        return new NextResponse(result as any as ReadableStream)
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '下载文件失败'
        return new NextResponse(message, { status: 500 })
    }
} 