import { NextResponse } from "next/server";
import { UserWithID } from "@/types/system/user"
import { SignJWT, jwtVerify } from 'jose';
import { randomUUID } from 'crypto';

export const EXPIRED_TIME =
    Number(process.env.EXPIRED_DAYS) * 24 * 60 * 60 +
    Number(process.env.EXPIRED_HOURS) * 60 * 60 +
    Number(process.env.EXPIRED_MINUTES) * 60 +
    Number(process.env.EXPIRED_SECONDS);

export function buildResponse<T>({ data, message, status = 200 }: { data?: T, message: string, status?: number }) {
    return NextResponse.json({
        status,
        success: status >= 200 && status < 300,
        message,
        data,
    });
}

export function checkProps<T extends Object>(obj: T, props: (keyof T)[]) {
    const result = props.every(prop => obj[prop] !== undefined && obj[prop] !== null && obj[prop] !== '');
    if (!result) {
        throw new Error(`缺少必要的属性: ${props.filter(prop => obj[prop] === undefined || obj[prop] === null || obj[prop] === '').join(', ')}`);
    }
}

export async function getHeadUserData(headersList: Headers): Promise<UserWithID> {
    const userDataJSON = headersList.get(process.env.SERVER_USERHEADER!)
    const userData = userDataJSON ? JSON.parse(decodeURIComponent(userDataJSON)) as UserWithID : null
    if (!userData || !userData.id) throw new Error('用户数据未找到')
    return userData
}

export async function serverEncrypt(text: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// 生成访问令牌
export async function generateAccessToken(userId: string) {
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setJti(randomUUID())
        .setIssuedAt()
        .setExpirationTime(EXPIRED_TIME + "s")
        .sign(secret);
}

// 验证令牌
export async function verifyToken(token: string) {
    const { payload } = await jwtVerify<{ userId: string }>(token, secret);
    return payload;
}