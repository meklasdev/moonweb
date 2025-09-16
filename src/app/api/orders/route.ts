import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'orders');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function GET(req: NextRequest) {
  ensureDataDir();
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const orders = files.map(f => {
    try { return JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')); } catch { return null; }
  }).filter(Boolean);
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  ensureDataDir();
  const body = await req.json();
  const id = body.id || Date.now().toString();
  const filePath = path.join(DATA_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify({ ...body, id }, null, 2), 'utf8');
  return NextResponse.json({ ok: true, id });
}
