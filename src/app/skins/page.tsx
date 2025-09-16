"use client";

import React, { useEffect, useState } from 'react';
import SkinViewer from '../../components/SkinViewer';

type Skin = { id: string; name: string; description?: string; tags?: string[]; skinUrl: string };

export default function SkinsPage() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [selected, setSelected] = useState<Skin | null>(null);

  useEffect(() => {
    fetch('/api/skins')
      .then((r) => r.json())
      .then((data) => {
        setSkins(data || []);
        if (data && data.length) setSelected(data[0]);
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontFamily: 'Daydream' }}>Skins</h1>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 320 }}>
          {skins.map((s) => (
            <div key={s.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setSelected(s)} style={{ padding: '8px 12px' }}>
                  {s.name}
                </button>
                <span style={{ fontSize: 12, color: '#666' }}>{s.tags?.join(', ')}</span>
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>{s.description}</div>
            </div>
          ))}
        </div>

        <div>
          {selected ? (
            <SkinViewer skinUrl={selected.skinUrl} width={360} height={480} />
          ) : (
            <div style={{ width: 360, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>No selection</div>
          )}
        </div>
      </div>
    </div>
  );
}
