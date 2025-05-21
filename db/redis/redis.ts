"use server";
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL!
});


export async function redisConnection<T>(callback: () => Promise<T | null>): Promise<T | null> {
  await client.connect();
  try {
    return await callback();
  } finally {
    await client.close();
  }
}

// 存储用户当前活跃会话
export async function setUserSession(userId: string, tokenId: string, expiresIn: number) {
  await redisConnection(async () => {
    // 1. tokenId -> userId 映射（用于验证请求）
    // 2. userId -> tokenId 映射（用于登录顶替）
    await Promise.all([
      client.setEx(`session:${tokenId}`, expiresIn, userId),
      client.setEx(`user:${userId}:token`, expiresIn, tokenId)
    ]);
  });
}

// 验证会话有效性
export async function verifySession(tokenId: string, userId: string) {
  const result = await redisConnection(async () => {
    const [storedUserId, activeTokenId] = await Promise.all([
      client.get(`session:${tokenId}`),
      client.get(`user:${userId}:token`)
    ]);
    return storedUserId === userId && activeTokenId === tokenId;
  });
  if (result === null) return false;
  return result;
}

// 移除用户所有会话
export async function removeUserSession(userId: string) {
  await redisConnection(async () => {
    const tokenId = await client.get(`user:${userId}:token`);
    if (tokenId) {
      await Promise.all([
        client.del(`session:${tokenId}`),
        client.del(`user:${userId}:token`)
      ]);
    } else throw new Error("token不存在");
  });
}