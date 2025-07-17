import { createClient } from 'redis';

export const client = createClient({
  url: process.env.REDIS_URL!
});

// 存储用户当前活跃会话
export async function setUserSession(userId: string, tokenId: string, expiresIn: number) {
  if (!client.isOpen) {
    await client.connect();
  }
  // 1. tokenId -> userId 映射（用于验证请求）
  // 2. userId -> tokenId 映射（用于登录顶替）
  await Promise.all([
    client.setEx(`session:${tokenId}`, expiresIn, userId),
    client.setEx(`user:${userId}:token`, expiresIn, tokenId)
  ]);
}

// 验证会话有效性
export async function verifySession(tokenId: string, userId: string) {
  if (!client.isOpen) {
    await client.connect();
  }
  const [storedUserId, activeTokenId] = await Promise.all([
    client.get(`session:${tokenId}`),
    client.get(`user:${userId}:token`)
  ]);
  return storedUserId === userId && activeTokenId === tokenId;
}

// 移除用户所有会话
export async function removeUserSession(userId: string) {
  if (!client.isOpen) {
    await client.connect();
  }
  const tokenId = await client.get(`user:${userId}:token`);
  if (tokenId) {
    await Promise.all([
      client.del(`session:${tokenId}`),
      client.del(`user:${userId}:token`)
    ]);
  }
}