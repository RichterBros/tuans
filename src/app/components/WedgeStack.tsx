"use client";
import React, { useEffect, useRef } from "react";

type WedgeStackProps = {
  enableParallax?: boolean;
  topColor?: string;
  midColor?: string;
  botColor?: string;
  topSize?: number; // px
  gap?: number; // px added to each lower band
};

export default function WedgeStack({
  enableParallax = true,
  topColor = "#ffdf32",
  midColor = "#ffb700",
  botColor = "#ff9f0a",
  topSize = 240,
  gap = 120,
}: WedgeStackProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableParallax) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      const topScale = Math.min(1 + y * 0.002, 4.0);
      const midScale = Math.min(1 + y * 0.003, 5.0);
      const botScale = Math.min(1 + y * 0.004, 6.0);
      if (topRef.current) topRef.current.style.transform = `translateY(${(y * 0.05).toFixed(0)}px) scale(${topScale.toFixed(3)})`;
      if (midRef.current) midRef.current.style.transform = `translateY(${(y * 0.10).toFixed(0)}px) scale(${midScale.toFixed(3)})`;
      if (botRef.current) botRef.current.style.transform = `translateY(${(y * 0.15).toFixed(0)}px) scale(${botScale.toFixed(3)})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enableParallax]);

  const midSize = topSize + gap;
  const botSize = topSize + gap * 2;

  return (
    <>
      {/* Bottom band */}
      <div
        ref={botRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${botSize}px`,
          height: `${botSize}px`,
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          background: `linear-gradient(to top, ${botColor} 0%, rgba(255,159,10,0.1) 100%)`,
          pointerEvents: "none",
          zIndex: 1000,
        }}
      />
      {/* Middle band */}
      <div
        ref={midRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${midSize}px`,
          height: `${midSize}px`,
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          background: `linear-gradient(to top, ${midColor} 0%, rgba(255,183,0,0.1) 100%)`,
          pointerEvents: "none",
          zIndex: 1001,
        }}
      />
      {/* Top band */}
      <div
        ref={topRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${topSize}px`,
          height: `${topSize}px`,
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          background: `linear-gradient(to top, ${topColor} 0%, rgba(255,223,50,0.1) 100%)`,
          pointerEvents: "none",
          zIndex: 1002,
        }}
      />
    </>
  );
}


