"use client"
import { ApiResponse } from '@/types/api';
import { MessageInstance } from 'antd/lib/message/interface';
export async function fetchData<T = undefined, S = undefined>(url: string, options?: { body: S, message?: MessageInstance }): Promise<T | undefined> {
    const { body, message } = options || {};
    try {
        const response = await fetch(url, { body: JSON.stringify(body), method: 'POST' });
        if (!response.ok) throw new Error('网络错误')
        const result: ApiResponse<T> = await response.json();
        if (!result.success) throw new Error(result.message);
        else {
            if (message) message.success({ content: result.message })
            return result.data;
        }
    } catch (e) {
        console.error(e);
        const errorMessage = (e as Error).message
        if (message) message.error({ content: errorMessage })
        throw e
    }
}

export async function fetchFormdata<T = undefined>(url: string, formData: FormData, message?: MessageInstance): Promise<T | undefined> {
    try {
        const response = await fetch(url, { method: 'POST', body: formData });
        if (!response.ok) throw new Error('网络错误')
        const result: ApiResponse<T> = await response.json();
        if (!result.success) throw new Error(result.message);
        else {
            if (message) message.success({ content: result.message })
            return result.data;
        }
    } catch (e) {
        console.error(e);
        const errorMessage = (e as Error).message
        if (message) message.error({ content: errorMessage })
        throw e
    }
}


export async function downloadFile(fileId: string, message: MessageInstance) {
    const response = await fetch(`/api/system/file/download`, { method: 'POST', body: JSON.stringify({ fileId }) });
    if (!response.ok) {
        const error = await response.text()
        message.error({ content: error })
        throw new Error(error)
    }
    return response.blob()
}