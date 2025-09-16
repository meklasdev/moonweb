import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/withUser';

const SESSIONS_DIR = path.join(process.cwd(), 'data', 'sessions');

async function handler(request: Request, _user: any) {
  try {
    const files = await fs.promises.readdir(SESSIONS_DIR).catch(() => []);
    const sessions = await Promise.all(
      files.map(async (f) => {
        const raw = await fs.promises.readFile(path.join(SESSIONS_DIR, f), 'utf-8');
        return JSON.parse(raw);
      })
    );
    return NextResponse.json(sessions);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export const GET = requireAdmin(handler);
