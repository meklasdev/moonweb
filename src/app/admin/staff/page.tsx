"use client";

import React, { useEffect, useState } from 'react';

type Staff = { id: string; nick?: string; name: string; role: string; skinUrl?: string; bio?: string };

export default function AdminStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [editing, setEditing] = useState<Staff | null>(null);

  async function fetchStaff() {
    const res = await fetch('/api/staff');
    const data = await res.json();
    setStaff(data || []);
  }

  useEffect(() => { fetchStaff(); }, []);

  async function save(s: Staff) {
    const exists = staff.find(x => x.id === s.id);
    if (exists) {
      await fetch('/api/admin/staff', { method: 'PUT', body: JSON.stringify(s) });
    } else {
      await fetch('/api/admin/staff', { method: 'POST', body: JSON.stringify(s) });
    }
    setEditing(null);
    fetchStaff();
  }

  async function remove(id: string) {
    await fetch('/api/admin/staff?id=' + encodeURIComponent(id), { method: 'DELETE' });
    fetchStaff();
  }

  async function uploadSkin(file: File) {
    const b = await file.arrayBuffer();
    const base64 = Buffer.from(b).toString('base64');
    const res = await fetch('/api/admin/upload-skin', { method: 'POST', body: JSON.stringify({ image: base64, filename: file.name }) });
    return res.json();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin — Staff</h1>
  <button onClick={() => setEditing({ id: String(Date.now()), nick: '', name: '', role: '', skinUrl: '', bio: '' })}>Add member</button>
      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {staff.map(s => (
          <div key={s.id} style={{ border: '1px solid #ddd', padding: 12 }}>
            <strong>{s.name}</strong> — <em>{s.role}</em>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => setEditing(s)}>Edit</button>
                <button onClick={() => remove(s.id)} style={{ marginLeft: 8 }}>Delete</button>
              </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ marginTop: 18, borderTop: '1px solid #eee', paddingTop: 12 }}>
          <h3>Edit</h3>
          <div>
            <label>Nick (MC username)</label>
            <input value={editing.nick} onChange={e => setEditing({ ...editing, nick: e.target.value })} />
          </div>
          <div>
            <label>Name</label>
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
          </div>
          <div>
            <label>Role</label>
            <input value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} />
          </div>
          <div>
            <label>Bio</label>
            <textarea value={editing.bio} onChange={e => setEditing({ ...editing, bio: e.target.value })} />
          </div>
          <div>
            <label>Skin file (optional)</label>
            <input type="file" onChange={async e => {
              const f = e.target.files?.[0];
              if (!f) return;
              const out = await uploadSkin(f);
              if (out && out.url) setEditing({ ...editing, skinUrl: out.url });
            }} />
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => save(editing)}>Save</button>
            <button onClick={() => setEditing(null)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
