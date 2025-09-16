import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { getSession } from './auth';

const USERS_DIR = path.join(process.cwd(), 'data', 'users');

export async function getServerUser() {
  try {
  const c = await cookies();
  const sessionId = c.get?.('mc_session')?.value;
    const session = await getSession(sessionId);
    if (!session) return null;
    const raw = await fs.promises.readFile(path.join(USERS_DIR, `${session.userId}.json`), 'utf-8').catch(() => null);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (u.token) delete u.token;
    return u;
  } catch (e) {
    return null;
  }
}
