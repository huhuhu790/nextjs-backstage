import { NextResponse } from 'next/server';
import { createMessageEventListner } from '@/db/mongodb/messageCollection';
import { getHeadUserData } from '@/utils/getHeadUserData';
import { toLocalMessage } from '../messageDataTrans';

export async function GET(request: Request) {
    try {
        const userData = await getHeadUserData()
        if (!userData || !userData.id) throw new Error('用户未登录')
        // 初始化 SSE 流
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                await createMessageEventListner((doc) => {
                    console.log(doc);
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(toLocalMessage(doc))}\n\n`));
                }, userData.id!)
            },
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.log(error);
        const message = (error as Error).message || '获取失败'
        return new NextResponse(message, { status: 500 })
    }
}