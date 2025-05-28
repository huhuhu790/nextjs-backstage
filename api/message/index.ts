import { PaginationRequest, PaginationResponse } from "@/types/database";
import { fetchData } from "../fetchApi";
import { LocalMessage } from "@/types/api";

export async function getMessageListByPage(body: PaginationRequest) {
    return fetchData<PaginationResponse<LocalMessage[]>, PaginationRequest>('/api/system/message/getMessageListByPage', {
        body
    })
}

export async function sendingMessage(body: LocalMessage) {
    return fetchData<null, LocalMessage>('/api/system/message/sendingMessage', {
        body
    })
}

export function pushingMessage(callback: (event: MessageEvent) => void) {
    const eventSource = new EventSource('/api/system/message/pushingMessage');

    eventSource.onmessage = (event) => {
        callback(event)
    };

    return () => eventSource.close(); // 清理连接
}

