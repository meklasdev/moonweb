import IORedis from 'ioredis';

let client: IORedis.Redis | null = null;

export function getRedis() {
  if (client) return client;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  client = new IORedis(url);
  return client;
}
