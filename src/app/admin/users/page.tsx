"use client";

import React, { useEffect, useState } from 'react';

type User = any;
type Session = any;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else setError(data?.error || 'failed to load users');
      })
      .catch(() => setUsers([]));
    fetch('/api/admin/sessions')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
        else setError(data?.error || 'failed to load sessions');
      })
      .catch(() => setSessions([]));
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    // reload to reflect unauthenticated state
    window.location.reload();
  }

  async function revoke(sessionId: string) {
    await fetch('/api/auth/revoke', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) });
    // refresh lists
    const s = await fetch('/api/admin/sessions').then(r => r.json()).catch(() => []);
    setSessions(s);
  }

  async function cleanup() {
    const res = await fetch('/api/admin/cleanup-sessions', { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    // refresh sessions
    const s = await fetch('/api/admin/sessions').then(r => r.json()).catch(() => []);
    setSessions(s);
    if (data?.removed) alert('Removed ' + data.removed + ' expired sessions');
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin: Users</h2>
      <section style={{ marginBottom: 24 }}>
  <h3>Users ({users.length})</h3>
  {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <ul>
          {users.map((u) => (
            <li key={u.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span>{u.username || u.id} — {u.email || 'no-email'}</span>
              <button onClick={async ()=>{ await fetch('/api/admin/promote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: u.id }) }); window.location.reload(); }}>Promote</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Sessions ({sessions.length})</h3>
          <div>
            <button onClick={logout} style={{ marginRight: 12 }}>Logout</button>
            <button onClick={cleanup}>Cleanup expired</button>
          </div>
        </div>
        <ul>
          {Array.isArray(sessions) && sessions.map((s) => (
            <li key={s.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span>{s.id} — user: {s.userId} — created: {s.createdAt}</span>
              <button onClick={() => revoke(s.id)}>Revoke</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
