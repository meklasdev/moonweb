import fs from 'fs';
import path from 'path';
import { getRedis } from './redis';

const SESSIONS_DIR = path.join(process.cwd(), 'data', 'sessions');

export async function getSession(sessionId: string | undefined) {
  if (!sessionId) return null;
  const redis = getRedis();
  if (redis) {
    try {
      const raw = await redis.get(`session:${sessionId}`);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      // Redis keys may expire automatically, but double-check expiresAt
      if (obj.expiresAt && new Date(obj.expiresAt).getTime() < Date.now()) {
        await redis.del(`session:${sessionId}`).catch(() => {});
        return null;
      }
      return obj;
    } catch (e) {
      return null;
    }
  }

  // file fallback
  try {
    const p = path.join(SESSIONS_DIR, `${sessionId}.json`);
    const raw = await fs.promises.readFile(p, 'utf-8');
    const obj = JSON.parse(raw);
    // enforce expiry if present
    if (obj.expiresAt) {
      const t = new Date(obj.expiresAt).getTime();
      if (isNaN(t) || t < Date.now()) {
        // expired - remove file and return null
        await fs.promises.unlink(p).catch(() => {});
        return null;
      }
    }
    return obj;
  } catch (e) {
    return null;
  }
}

export async function destroySession(sessionId: string | undefined) {
  if (!sessionId) return false;
  const redis = getRedis();
  if (redis) {
    try {
      await redis.del(`session:${sessionId}`);
      return true;
    } catch (e) {
      return false;
    }
  }
  try {
    const p = path.join(SESSIONS_DIR, `${sessionId}.json`);
    await fs.promises.unlink(p).catch(() => {});
    return true;
  } catch (e) {
    return false;
  }
}

export async function createSession(userId: string, ttlSeconds?: number) {
  const crypto = await import('crypto');
  const id = crypto.randomBytes(18).toString('hex');
  const ttl = ttlSeconds && ttlSeconds > 0 ? ttlSeconds : 60 * 60 * 24 * 7; // default 7 days
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  const sessionObj = { id, userId, createdAt: new Date().toISOString(), expiresAt };

  const redis = getRedis();
  if (redis) {
    try {
      await redis.set(`session:${id}`, JSON.stringify(sessionObj), 'EX', Math.max(1, Math.floor(ttl)));
      return sessionObj;
    } catch (e) {
      // fall through to file fallback
    }
  }

  // file fallback
  try {
    await fs.promises.mkdir(SESSIONS_DIR, { recursive: true });
    const p = path.join(SESSIONS_DIR, `${id}.json`);
    await fs.promises.writeFile(p, JSON.stringify(sessionObj, null, 2));
    return sessionObj;
  } catch (e) {
    throw e;
  }
}
