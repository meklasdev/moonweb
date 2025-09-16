import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'orders');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  ensureDataDir();
  const file = path.join(DATA_DIR, `${params.id}.json`);
  if (!fs.existsSync(file)) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  ensureDataDir();
  const action = req.nextUrl.pathname.split('/').pop();
  const file = path.join(DATA_DIR, `${params.id}.json`);
  if (!fs.existsSync(file)) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  // simple action handling: take, denile, moreinfo, read, complete
  if (action === 'read') data.read = true;
  else if (action === 'take') data.status = 'taken';
  else if (action === 'denile') data.status = 'denied';
  else if (action === 'moreinfo') data.status = 'moreinfo';
  else if (action === 'complete') data.status = 'completed';

  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  return NextResponse.json({ ok: true, action });
}
