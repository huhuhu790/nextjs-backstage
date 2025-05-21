"use server";
import { SignJWT, jwtVerify } from 'jose';
import { randomUUID } from 'crypto';
import { EXPIRED_TIME } from '@/utils/getExpiredTime';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

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