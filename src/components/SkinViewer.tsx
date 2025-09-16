"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  skinUrl?: string;
  username?: string;
  width?: number;
  height?: number;
};

export default function SkinViewer({ skinUrl, username, width = 300, height = 400 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let viewer: any = null;
    let anim: any = null;

    async function init() {
      const skinview3d = await import("skinview3d");
      const { createApp, Skin } = skinview3d as any;

      if (!containerRef.current) return;

      viewer = createApp({ width, height });
      containerRef.current.appendChild(viewer.renderer.domElement);

      const skin = new Skin();
      // prefer username (Crafatar) when present, otherwise use provided skinUrl
      if (username && username.length > 0) {
        skin.src = `https://crafatar.com/skins/${encodeURIComponent(username)}`;
      } else if (skinUrl) {
        skin.src = skinUrl;
      } else {
        // fallback: blank/empty texture
        skin.src = '';
      }
      viewer.loadSkin(skin);

      viewer.camera.position.set(0, 20, 50);

      function loop() {
        viewer.update();
        anim = requestAnimationFrame(loop);
      }

      loop();
    }

    init().catch((e) => console.error("SkinViewer init error:", e));

    return () => {
      if (anim) cancelAnimationFrame(anim);
      try {
        if (containerRef.current && containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      } catch (e) {
        // ignore
      }
    };
  }, [skinUrl, width, height]);

  return <div ref={containerRef} style={{ width, height }} />;
}
