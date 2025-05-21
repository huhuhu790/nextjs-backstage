"use client"
import { message } from 'antd';
import { ApiResponse } from '@/types/api';
export async function fetchData<T = undefined, S = undefined>(url: string, body?: S): Promise<T | undefined> {
    const response = await fetch(url, { body: JSON.stringify(body), method: 'POST' });
    if (!response.ok) {
        throw new Error('网络错误');
    }
    const result: ApiResponse<T> = await response.json();
    if (!result.success) {
        message.error({
            type: 'error',
            content: result.message,
        });
        throw new Error(result.message);
    } else return result.data;
}