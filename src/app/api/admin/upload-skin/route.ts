import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/withUser';

const SKINS_DIR = path.join(process.cwd(), 'public', 'skins');
const SKINS_JSON = path.join(process.cwd(), 'data', 'skins.json');

async function ensureDir(dir: string) {
  try { await fs.promises.mkdir(dir, { recursive: true }); } catch (e) {}
}

async function handler(request: Request, _user: any) {
  try {
    const body = await request.json();
    const { filename, data, name, description, tags } = body || {};
    if (!filename || !data) return NextResponse.json({ error: 'missing' }, { status: 400 });

    await ensureDir(SKINS_DIR);
    const buf = Buffer.from(data, 'base64');
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const outPath = path.join(SKINS_DIR, safeName);
    await fs.promises.writeFile(outPath, buf);

    // append to skins.json
    let skins = [];
    try { skins = JSON.parse(await fs.promises.readFile(SKINS_JSON, 'utf-8')); } catch (e) { skins = []; }
    const id = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() : 'skin-' + Date.now();
    const entry = { id, name: name || safeName, description: description || '', tags: tags || [], skinUrl: '/skins/' + safeName };
    skins.push(entry);
    await fs.promises.writeFile(SKINS_JSON, JSON.stringify(skins, null, 2));

  return NextResponse.json({ ok: true, entry, url: entry.skinUrl });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export const POST = requireAdmin(handler);
