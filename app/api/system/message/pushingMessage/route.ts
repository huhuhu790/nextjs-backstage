import { NextResponse } from 'next/server';
import { createMessageEventListener } from '@/db/mongodb/messageCollection';
import { getHeadUserData } from '@/utils/serverUtils';
import { toLocalMessage } from '../dataTransform';
import { headers } from 'next/headers';

export async function GET() {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        // 初始化 SSE 流
        const encoder = new TextEncoder();
        const { readable, writable } = new TransformStream();

        await createMessageEventListener((doc) => {
            const message = JSON.stringify((toLocalMessage(doc)))
            const writer = writable.getWriter();
            writer.write(encoder.encode(`data: ${message}\n\n`)).then().catch(console.error)
            writer.releaseLock()
        }, userData.id!)

        return new NextResponse(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error(error);
        const message = (error as Error).message || '获取失败'
        return new NextResponse(message, { status: 400 })
    }
}