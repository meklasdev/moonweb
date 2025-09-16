import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/withUser';

const USERS_DIR = path.join(process.cwd(), 'data', 'users');

async function handler(request: Request, _user: any) {
  try {
    const body = await request.json();
    const userId = body?.userId;
    if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 });
    const userPath = path.join(USERS_DIR, `${userId}.json`);
    const raw = await fs.promises.readFile(userPath, 'utf-8').catch(() => null);
    if (!raw) return NextResponse.json({ error: 'user not found' }, { status: 404 });
    const userObj = JSON.parse(raw);
    userObj.isAdmin = true;
    await fs.promises.writeFile(userPath, JSON.stringify(userObj, null, 2));
    return NextResponse.json({ ok: true, user: userObj });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export const POST = requireAdmin(handler);
