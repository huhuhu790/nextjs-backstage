import { NextResponse } from "next/server";

export function buildResponse<T>({ data, message, status = 200 }: { data?: T, message: string, status?: number }) {
    return NextResponse.json({
        status,
        success: status >= 200 && status < 300,
        message,
        data,
    });
}