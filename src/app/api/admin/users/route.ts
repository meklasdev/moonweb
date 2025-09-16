import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/withUser';

const USERS_DIR = path.join(process.cwd(), 'data', 'users');

async function handler(request: Request, _user: any) {
  try {
    const files = await fs.promises.readdir(USERS_DIR).catch(() => []);
    const users = await Promise.all(
      files.map(async (f) => {
        const raw = await fs.promises.readFile(path.join(USERS_DIR, f), 'utf-8');
        return JSON.parse(raw);
      })
    );
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export const GET = requireAdmin(handler);
