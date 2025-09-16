import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const USERS_DIR = path.join(process.cwd(), 'data', 'users');
const SESSIONS_DIR = path.join(process.cwd(), 'data', 'sessions');

async function ensureDir(dir: string) {
  try {
    await fs.promises.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function createSessionId() {
  return crypto.randomBytes(18).toString('hex');
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');

  if (!code) return NextResponse.json({ error: 'missing code' }, { status: 400 });

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback';

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET not configured' }, { status: 500 });
  }

  try {
    // validate state cookie
    const cookies = (request as any).cookies;
  const stateCookie = cookies?.get ? cookies.get('discord_oauth_state')?.value : null;
  const sigCookie = cookies?.get ? cookies.get('discord_oauth_sig')?.value : null;
  // validate signature
  const secret = process.env.DISCORD_STATE_SECRET;
  if (!secret) return NextResponse.json({ error: 'DISCORD_STATE_SECRET not configured' }, { status: 500 });
  const expectedSig = require('crypto').createHmac('sha256', secret).update(String(stateCookie)).digest('hex');
  if (!sigCookie || expectedSig !== sigCookie) return NextResponse.json({ error: 'invalid state signature' }, { status: 400 });
    if (!stateParam || !stateCookie || stateParam !== stateCookie) {
      return NextResponse.json({ error: 'invalid state' }, { status: 400 });
    }

    // exchange code for token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'failed to obtain access_token', details: tokenData }, { status: 500 });
    }

    // fetch user
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();

    // save user to data/users/{id}.json
    await ensureDir(USERS_DIR);
    const outPath = path.join(USERS_DIR, `${userData.id}.json`);
    await fs.promises.writeFile(outPath, JSON.stringify({ ...userData, token: tokenData }, null, 2));

  // create session using centralized helper
  // @ts-ignore - dynamic import of local helper
  const sessionObj = await (await import('../../../../lib/auth')).createSession(String(userData.id));
  const sessionId = sessionObj.id;

    // respond with a redirect and set a secure httpOnly cookie for session
    const res = NextResponse.redirect('/');
  const isProd = process.env.NODE_ENV === 'production';
  res.cookies.set('mc_session', sessionId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, secure: isProd, sameSite: 'lax' });
    // clear the oauth state cookie
  res.cookies.set('discord_oauth_state', '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('discord_oauth_sig', '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
