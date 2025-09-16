import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const STAFF_PATH = path.join(process.cwd(), 'data', 'staff.json');

export async function GET() {
  try {
    const raw = await fs.promises.readFile(STAFF_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}
