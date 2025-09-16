"use client";

import React from "react";
import dynamic from "next/dynamic";

const SkinViewer = dynamic(() => import("../../components/SkinViewer"), { ssr: false });

export default function SkinPage() {
  const sampleSkin = "/file.svg"; // replace with actual skin image path or URL

  return (
    <main style={{ padding: 20 }}>
      <h1>Skin Viewer Demo</h1>
      <p>Demo render using <code>skinview3d</code>. Replace <code>sampleSkin</code> with a Minecraft skin PNG.</p>
      <div style={{ border: "1px solid #ddd", display: "inline-block" }}>
        <SkinViewer skinUrl={sampleSkin} width={320} height={400} />
      </div>
    </main>
  );
}
