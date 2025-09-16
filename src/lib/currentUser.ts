import fs from 'fs';
import path from 'path';
import { getSession } from './auth';

const USERS_DIR = path.join(process.cwd(), 'data', 'users');

export async function getCurrentUserFromRequest(request: Request) {
  const cookies = (request as any).cookies;
  const sessionId = cookies?.get ? cookies.get('mc_session')?.value : null;
  const session = await getSession(sessionId);
  if (!session) return null;
  try {
    const raw = await fs.promises.readFile(path.join(USERS_DIR, `${session.userId}.json`), 'utf-8');
    const u = JSON.parse(raw);
    // don't return token to clients
    if (u.token) delete u.token;
    return u;
  } catch (e) {
    return null;
  }
}
