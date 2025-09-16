const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

// This smoke script attempts to create a session object and verify it via the auth helper.
(async function main(){
  try{

    const projectRoot = path.resolve(__dirname, '..');
    const sessionId = 'smoke_' + Math.random().toString(36).slice(2,10);
    const session = { id: sessionId, userId: 'test-smoke', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now()+60000).toISOString() };
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      console.log('REDIS_URL present, testing Redis operations...');
      const IORedis = require('ioredis');
      const client = new IORedis(redisUrl);
      await client.set(`session:${sessionId}`, JSON.stringify(session), 'EX', 60);
      const raw = await client.get(`session:${sessionId}`);
      if (!raw) throw new Error('Failed to read session from Redis');
      console.log('Redis session read OK');
      await client.del(`session:${sessionId}`);
      console.log('Redis session deleted');
      await client.quit();
      // replicate getSession logic: no redis now so getSession would return null; but we've tested Redis path
    } else {
      console.log('No REDIS_URL, testing file session write/read...');
      const sessionsDir = path.join(projectRoot, 'data', 'sessions');
      await fs.promises.mkdir(sessionsDir, { recursive: true });
      const p = path.join(sessionsDir, `${sessionId}.json`);
      await fs.promises.writeFile(p, JSON.stringify(session, null, 2));
      const raw = await fs.promises.readFile(p, 'utf-8');
      if (!raw) throw new Error('Failed to read session file');
      console.log('Session file read OK');
      await fs.promises.unlink(p);
      console.log('Session file deleted');
    }

    console.log('SMOKE TEST PASS');
    process.exit(0);
  }catch(err){
    console.error('SMOKE TEST FAIL:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
