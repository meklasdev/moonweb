import { NextResponse } from 'next/server';
import crypto from 'crypto';

function randomState() {
  return crypto.randomBytes(16).toString('hex');
}

function signState(state: string) {
  const secret = process.env.DISCORD_STATE_SECRET;
  if (!secret) return null;
  return crypto.createHmac('sha256', secret).update(state).digest('hex');
}

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/discord/callback';

  if (!clientId) {
    return NextResponse.json({ error: 'DISCORD_CLIENT_ID not configured' }, { status: 500 });
  }

  const state = randomState();
  const sig = signState(state);
  if (!sig) {
    return NextResponse.json({ error: 'DISCORD_STATE_SECRET not configured' }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify email',
    state,
    prompt: 'consent',
  });

  const res = NextResponse.redirect('https://discord.com/api/oauth2/authorize?' + params.toString());
  // set state cookie (httpOnly, secure in production)
  // set state cookie and signature cookie
  res.cookies.set('discord_oauth_state', state, { httpOnly: true, path: '/', maxAge: 300 });
  res.cookies.set('discord_oauth_sig', sig, { httpOnly: true, path: '/', maxAge: 300 });
  return res;
}
