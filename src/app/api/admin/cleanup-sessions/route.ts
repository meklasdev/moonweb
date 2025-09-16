import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/withUser';

const SESSIONS_DIR = path.join(process.cwd(), 'data', 'sessions');

async function handler(request: Request, _user: any) {
  try {
    const files = await fs.promises.readdir(SESSIONS_DIR).catch(() => []);
    const now = Date.now();
    let removed = 0;
    await Promise.all(
      files.map(async (f) => {
        try {
          const raw = await fs.promises.readFile(path.join(SESSIONS_DIR, f), 'utf-8');
          const s = JSON.parse(raw);
          if (s.expiresAt && new Date(s.expiresAt).getTime() < now) {
            await fs.promises.unlink(path.join(SESSIONS_DIR, f)).catch(() => {});
            removed++;
          }
        } catch (e) {
          // ignore
        }
      })
    );
    return NextResponse.json({ ok: true, removed });
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export const POST = requireAdmin(handler);
