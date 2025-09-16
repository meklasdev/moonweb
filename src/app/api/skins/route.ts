import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const SKINS_PATH = path.join(process.cwd(), 'data', 'skins.json');

export async function GET() {
  try {
    const raw = await fs.promises.readFile(SKINS_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(raw));
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw = await fs.promises.readFile(SKINS_PATH, 'utf-8');
    const skins = JSON.parse(raw);
    skins.push(body);
    await fs.promises.writeFile(SKINS_PATH, JSON.stringify(skins, null, 2));
    return NextResponse.json(body, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
