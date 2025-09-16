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
      if (!containerRef.current) return;
      
      // Add loading state
      containerRef.current.innerHTML = '<div class="loading-shimmer" style="width: 100%; height: 100%; border-radius: 8px;"></div>';
      
      const skinview3d = await import("skinview3d");
      const { createApp, Skin } = skinview3d as any;

      // Clear loading state
      containerRef.current.innerHTML = '';

      viewer = createApp({ width, height });
      viewer.renderer.domElement.style.borderRadius = '8px';
      viewer.renderer.domElement.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
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
      
      // Add smooth rotation
      let rotation = 0;

      function loop() {
        rotation += 0.005;
        if (viewer.playerObject) {
          viewer.playerObject.rotation.y = rotation;
        }
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

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width, 
        height, 
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        border: '1px solid rgba(255,255,255,0.1)'
      }} 
    />
  );
}
