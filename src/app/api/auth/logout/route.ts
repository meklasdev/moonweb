import { NextResponse } from 'next/server';
import { destroySession } from '../../../../lib/auth';

export async function POST(request: Request) {
  try {
    const cookies = (request as any).cookies;
    const sessionId = cookies?.get ? cookies.get('mc_session')?.value : null;
    if (sessionId) {
      await destroySession(sessionId);
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set('mc_session', '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
