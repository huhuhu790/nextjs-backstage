"use client"
import { message } from 'antd';
import { ApiResponse } from '@/types/api';
export async function fetchData<T = undefined, S = undefined>(url: string, options?: { body?: S, showMessage?: boolean }): Promise<T | undefined> {
    const { body, showMessage = true } = options || {};
    const response = await fetch(url, { body: JSON.stringify(body), method: 'POST' });
    if (!response.ok) throw new Error('网络错误')
    const result: ApiResponse<T> = await response.json();
    if (!result.success) {
        message.error({ content: result.message })
        throw new Error(result.message);
    } else {
        if (showMessage) message.success({ content: result.message })
        return result.data;
    }
}

export async function fetchFormdata<T = undefined>(url: string, formData: FormData, showMessage = true): Promise<T | undefined> {
    const response = await fetch(url, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('网络错误')
    const result: ApiResponse<T> = await response.json();
    if (!result.success) {
        message.error({ content: result.message })
        throw new Error(result.message);
    } else {
        if (showMessage) message.success({ content: result.message })
        return result.data;
    }
}


export async function downloadFile(fileId: string) {
    const response = await fetch(`/api/system/file/download`, { method: 'POST', body: JSON.stringify({ fileId }) });
    if (!response.ok) {
        const error = await response.text()
        message.error({ content: error })
        throw new Error(error)
    }
    return response.blob()
}