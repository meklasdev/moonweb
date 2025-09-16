"use client";

import React, { useEffect, useState } from 'react';

export default function LoginPage() {
  const [me, setMe] = useState<any>(null);
  const [bootId, setBootId] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(setMe).catch(() => setMe(null));
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  }

  async function bootstrap() {
    const res = await fetch('/api/admin/bootstrap', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: bootId }) });
    const data = await res.json();
    if (data?.ok) setMsg('Promoted ' + data.user.id);
    else setMsg('Error: ' + (data?.error || 'failed'));
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      {me ? (
        <div>
          <p>Signed in as <strong>{me.username || me.id}</strong> {me.isAdmin ? '(admin)' : ''}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Use Discord to sign in. This will redirect you to Discord's OAuth page and then back to the app.</p>
          <a href="/api/auth/discord">Continue with Discord</a>
        </div>
      )}

      <hr />
      <h3>Dev bootstrap</h3>
      <p>Set a user as admin (dev only).</p>
      <input placeholder="user id" value={bootId} onChange={(e)=>setBootId(e.target.value)} />
      <button onClick={bootstrap} style={{ marginLeft: 8 }}>Make admin</button>
      {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
    </div>
  );
}
