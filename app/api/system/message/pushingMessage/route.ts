import {NextResponse} from 'next/server';
import {createMessageEventListener} from '@/db/mongodb/messageCollection';
import {getHeadUserData} from '@/utils/getHeadUserData';
import {toLocalMessage} from '../dataTransform';
import {headers} from 'next/headers';
export async function GET(request: Request) {
    try {
        const headersList = await headers()
    const userData = await getHeadUserData(headersList);
        if (!userData || !userData.id) throw new Error('用户未登录')
        // 初始化 SSE 流
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    await createMessageEventListener((doc) => {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(toLocalMessage(doc))}\n\n`));
                    }, userData.id!)
                } catch (e) {
                    console.error(e);
                    await stream.cancel()
                }
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
        console.error(error);
        const message = (error as Error).message || '获取失败'
        return new NextResponse(message, {status: 400})
    }
}