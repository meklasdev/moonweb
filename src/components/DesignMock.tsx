"use client";

import React, { useEffect, useRef } from "react";

export default function DesignMock() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = rootRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="designmock-root" ref={rootRef}>
      {/* background panel */}
      <div className="page-bg designmock-bg">
        {/* Navbar */}
        <div className="mc-navbar">
          <div className="mc-navbar-inner">
            <div className="mc-brand">MOONCODE</div>
            <div className="mc-links">
              <a href="#" className="mc-cta">
                ZAUFALI
              </a>
              <a href="#" className="mc-cta">
                ZESPOL
              </a>
              <a href="#" className="mc-cta">
                PORTFOLIO
              </a>
              <a href="#" className="mc-cta">
                KONTAKT
              </a>
            </div>
          </div>
        </div>

        {/* Pixel hero */}
        <div className="designmock-hero-wrap">
          <div className="pixel-hero">
            <div className="pixel-lines">
              <span className="pixel-line grad-pro-1 animate-on-scroll">Profesjonalne realizacje</span>
              <span className="pixel-base">MEKLAS_ CHIEF</span>
            </div>
            <div className="logo-pill designmock-logo-pill">
              <img src="/file.svg" alt="logo" />
              <div className="logo-text">MOONCODE</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <img className="hero-banner animate-on-scroll" src="/banner.png" alt="banner" />
          </div>
        </div>

        {/* Big rounded card */}
        <div className="designmock-big-card animate-on-scroll" />

        {/* Right image placeholder (user asset) */}
        <img
          className="designmock-right-img dm-hero-image animate-on-scroll"
          src="/hero_zauflinam_zepol_ajeszce_powina_byc_media.png"
          alt="hero placeholder"
        />

        {/* White rotated strip behind ZAUFALI NAM */}
        <div className="zaufali-strip animate-on-scroll">
          <div className="zaufali-text">ZAUFALI NAM</div>
        </div>

        {/* Order card (simplified) */}
        <div className="designmock-order-card animate-on-scroll">
          <div className="designmock-order-title">zamowienie</div>
          <div style={{ height: 12 }} />
          <div className="designmock-order-progress">
            <div className="left">
              <div className="bar" />
              <div style={{ height: 8 }} />
              <div style={{ fontSize: 12, color: "#374151" }}>Step Name</div>
            </div>
            <div style={{ width: 200 }}>
              <div className="mc-cta" style={{ width: 156, height: 55 }}>
                WYSLIJ
              </div>
            </div>
          </div>
        </div>

        {/* Small image card */}
        <img
          className="designmock-small-img animate-on-scroll"
          src="/portfolio_kontakt_brakujenav_bara.png"
          alt="phone"
        />

        {/* Portfolio band with two cards */}
        <div className="designmock-portfolio animate-on-scroll">
          <div className="portfolio-card animate-on-scroll">
            <img
              src="/file.svg"
              alt="p1"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
            />
          </div>
          <div className="portfolio-card animate-on-scroll">
            <img
              src="/file.svg"
              alt="p2"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
            />
          </div>
        </div>

        {/* Contact band with modal */}
        <div className="designmock-contact animate-on-scroll">
          <div className="contact-modal animate-on-scroll">
            <div style={{ fontFamily: "Daydream", fontSize: 18, marginBottom: 8 }}>ZAMOWIENIE</div>
            <div style={{ height: 10 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, height: 12, background: "#e5e7eb", borderRadius: 6 }} />
              <div
                style={{
                  width: 120,
                  height: 36,
                  background: "#6366f1",
                  borderRadius: 8,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                WYSLIJ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
