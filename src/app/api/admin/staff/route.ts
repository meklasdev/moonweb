import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/withUser';

const STAFF_PATH = path.join(process.cwd(), 'data', 'staff.json');

async function readStaff() {
  try {
    const raw = await fs.promises.readFile(STAFF_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function writeStaff(arr: any[]) {
  await fs.promises.writeFile(STAFF_PATH, JSON.stringify(arr, null, 2));
}

function slugify(input: string) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const GET = requireAdmin(async (request: Request) => {
  const data = await readStaff();
  return NextResponse.json(data);
});

export const POST = requireAdmin(async (request: Request) => {
  const body = await request.json();
  if (!body || !body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  const staff = await readStaff();

  // generate id/slug from name if missing
  let id = body.id || slugify(body.name);
  if (!id) id = 'member-' + Date.now();

  // ensure uniqueness
  if (staff.find((s: any) => s.id === id)) {
    id = `${id}-${Date.now()}`;
  }

  const entry = { id, nick: body.nick || '', name: body.name, role: body.role || '', skinUrl: body.skinUrl || '', bio: body.bio || '' };
  staff.push(entry);
  await writeStaff(staff);
  return NextResponse.json({ ok: true, entry });
});

export const PUT = requireAdmin(async (request: Request) => {
  const body = await request.json();
  if (!body || !body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  const staff = await readStaff();
  const idx = staff.findIndex((s: any) => s.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 });
  // validate name
  if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  staff[idx] = { id: body.id, nick: body.nick || '', name: body.name, role: body.role || '', skinUrl: body.skinUrl || '', bio: body.bio || '' };
  await writeStaff(staff);
  return NextResponse.json({ ok: true, entry: staff[idx] });
});

export const DELETE = requireAdmin(async (request: Request) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  const staff = await readStaff();
  const filtered = staff.filter((s: any) => s.id !== id);
  await writeStaff(filtered);
  return NextResponse.json({ ok: true });
});
