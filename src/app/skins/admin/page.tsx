"use client";

import React, { useState } from 'react';

type FormState = {
  id: string;
  name: string;
  description: string;
  tags: string;
  skinUrl: string;
};

export default function AdminSkinsPage() {
  const [form, setForm] = useState<FormState>({ id: '', name: '', description: '', tags: '', skinUrl: '' });
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Saving...');
    try {
      const payload = {
        id: form.id || String(Date.now()),
        name: form.name,
        description: form.description,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        skinUrl: form.skinUrl,
      };

      const res = await fetch('/api/skins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('Saved');
        setForm({ id: '', name: '', description: '', tags: '', skinUrl: '' });
      } else {
        const err = await res.json().catch(() => ({}));
        setStatus('Error: ' + (err?.error || res.statusText));
      }
    } catch (e: any) {
      setStatus('Error: ' + String(e?.message || e));
    }
  }

  async function uploadFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((res, rej) => {
        reader.onload = () => res(String(reader.result));
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      // dataUrl: data:image/png;base64,AAA...
      const parts = dataUrl.split(',');
      const base64 = parts[1];

      const filename = file.name;
      const payload = { filename, data: base64, name: form.name || filename, description: form.description, tags: form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : [] };
      const res = await fetch('/api/admin/upload-skin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const body = await res.json();
      if (res.ok) {
        setStatus('Uploaded');
        // set skinUrl to the new path so user can save metadata if needed
        setForm({ ...form, skinUrl: body.entry.skinUrl, name: body.entry.name });
      } else {
        setStatus('Upload error: ' + (body?.error || res.statusText));
      }
    } catch (e: any) {
      setStatus('Upload failed: ' + String(e?.message || e));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontFamily: 'Daydream' }}>Admin: Add Skin</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <label>
          ID (optional)
          <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
        </label>

        <label>
          Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>

        <label>
          Description
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>

        <label>
          Tags (comma separated)
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </label>

        <label>
          Skin URL (e.g., /skins/my.png or https://...)
          <input required value={form.skinUrl} onChange={(e) => setForm({ ...form, skinUrl: e.target.value })} />
        </label>

        <label>
          Upload skin image
          <input type="file" accept="image/png,image/jpeg" onChange={(e)=>uploadFile(e.target.files?.[0])} />
          {uploading && <div>Uploading...</div>}
        </label>

        <div>
          <button type="submit" style={{ padding: '8px 14px' }}>Save skin</button>
          <span style={{ marginLeft: 12 }}>{status}</span>
        </div>
      </form>
    </div>
  );
}
