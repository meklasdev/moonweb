import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const USERS_DIR = path.join(process.cwd(), 'data', 'users');

export async function POST(request: Request) {
  // Harden: allow only in development or with BOOTSTRAP_TOKEN matching request
  try {
    const body = await request.json().catch(() => ({}));
    const token = body?.token || null;
    const allowedToken = process.env.BOOTSTRAP_TOKEN || null;
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && !allowedToken) return NextResponse.json({ error: 'bootstrap disabled' }, { status: 403 });
    if (!isDev && allowedToken && token !== allowedToken) return NextResponse.json({ error: 'invalid token' }, { status: 403 });

    const userId = body?.userId || process.env.BOOTSTRAP_ADMIN_ID;
    if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 });
    const p = path.join(USERS_DIR, `${userId}.json`);
    const raw = await fs.promises.readFile(p, 'utf-8').catch(() => null);
    if (!raw) return NextResponse.json({ error: 'user not found' }, { status: 404 });
    const u = JSON.parse(raw);
    u.isAdmin = true;
    await fs.promises.writeFile(p, JSON.stringify(u, null, 2));
    return NextResponse.json({ ok: true, user: u });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
