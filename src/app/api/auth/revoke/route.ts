import { NextResponse } from 'next/server';
import { destroySession } from '../../../../lib/auth';
import { requireAdmin } from '../../../../lib/withUser';

async function handler(request: Request, _user: any) {
  try {
    const body = await request.json();
    const sessionId = body?.sessionId;
    if (!sessionId) return NextResponse.json({ error: 'missing sessionId' }, { status: 400 });
    const ok = await destroySession(sessionId);
    return NextResponse.json({ ok });
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export const POST = requireAdmin(handler);
