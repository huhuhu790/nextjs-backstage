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

export async function uploadFile<T = undefined>(url: string, file: File, showMessage = true): Promise<T | undefined> {
    const formData = new FormData();
    formData.append('file', file);
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
