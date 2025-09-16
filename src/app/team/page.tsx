import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default async function TeamPage() {
  const p = path.join(process.cwd(), 'data', 'staff.json');
  let staff = [];
  try {
    const raw = await fs.promises.readFile(p, 'utf-8');
    staff = JSON.parse(raw);
  } catch (e) {
    staff = [];
  }

  return (
    <main style={{ padding: 24 }}>
      <div style={{ position: 'relative' }}>
        <div className="zaufali-strip"><div className="zaufali-text">ZAUFALI NAM</div></div>
        <h1 style={{ fontFamily: 'Daydream', fontSize: 48, marginBottom: 6 }}>Zespół</h1>
      </div>
      <div className="team-grid">
        {staff.map((s: any) => (
          <article key={s.id} className="team-card">
            <h3 style={{ fontFamily: 'Daydream' }}>{s.name}</h3>
            <p style={{ margin: '6px 0' }}>{s.role}</p>
            <p style={{ fontSize: 12 }}>{s.bio}</p>
            <div style={{ marginTop: 8 }}>
              <Link href={`/team/${s.id}`}>Zobacz profil</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
