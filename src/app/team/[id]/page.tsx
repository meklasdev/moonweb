import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';

const SkinViewer = dynamic(() => import('../../../components/SkinViewer'), { ssr: false });

export default async function MemberPage({ params }: { params: { id: string } }) {
  const p = path.join(process.cwd(), 'data', 'staff.json');
  let staff = [];
  try {
    const raw = await fs.promises.readFile(p, 'utf-8');
    staff = JSON.parse(raw);
  } catch (e) {
    staff = [];
  }
  const member = staff.find((s: any) => s.id === params.id);
  if (!member) return <div style={{ padding: 24 }}>Nie znaleziono członka zespołu</div>;

  return (
    <main style={{ padding: 24 }}>
      <div style={{ position: 'relative' }}>
        <div className="zaufali-strip"><div className="zaufali-text">ZAUFALI NAM</div></div>
        <h1 style={{ fontFamily: 'Daydream', fontSize: 48, marginBottom: 6 }}>{member.name}</h1>
      </div>
      <p>{member.role}</p>
      <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
        <div>
          {/* SkinViewer is client-only */}
          <SkinViewer skinUrl={member.skinUrl} username={member.nick} width={320} height={400} />
        </div>
        <div style={{ maxWidth: 520 }}>
          <h3>O {member.name}</h3>
          <p>{member.bio}</p>
        </div>
      </div>
    </main>
  );
}
