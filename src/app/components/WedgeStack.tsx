"use client";
import React, { useEffect, useRef } from "react";

type WedgeStackProps = {
  enableParallax?: boolean;
  topColor?: string;
  midColor?: string;
  botColor?: string;
  topSize?: number; // px
  gap?: number; // px added to each lower band
  position?: 'tl' | 'br';
};

export default function WedgeStack({
  enableParallax = true,
  topColor = "#ffffff",
  midColor = "#e5e7eb",
  botColor = "#9ca3af",
  topSize = 240,
  gap = 120,
  position = 'tl',
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
      const dir = position === 'tl' ? 1 : -1; // TL drifts down, BR drifts up
      if (topRef.current) topRef.current.style.transform = `translateY(${(dir * y * 0.05).toFixed(0)}px) scale(${topScale.toFixed(3)})`;
      if (midRef.current) midRef.current.style.transform = `translateY(${(dir * y * 0.10).toFixed(0)}px) scale(${midScale.toFixed(3)})`;
      if (botRef.current) botRef.current.style.transform = `translateY(${(dir * y * 0.15).toFixed(0)}px) scale(${botScale.toFixed(3)})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enableParallax]);

  const midSize = topSize + gap;
  const botSize = topSize + gap * 2;

  const basePos: React.CSSProperties = position === 'tl'
    ? { top: 0, left: 0 }
    : { bottom: 0, right: 0 };

  const clipPath = position === 'tl'
    ? 'polygon(0 0, 100% 0, 0 100%)'
    : 'polygon(100% 100%, 0 100%, 100% 0)';

  return (
    <>
      {/* Bottom band */}
      <div
        ref={botRef}
        className="wedge-layer wedge-bot"
        style={{
          ...basePos,
          width: `${botSize}px`,
          height: `${botSize}px`,
          clipPath,
          background: `linear-gradient(to top, ${botColor} 0%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
      {/* Middle band */}
      <div
        ref={midRef}
        className="wedge-layer wedge-mid"
        style={{
          ...basePos,
          width: `${midSize}px`,
          height: `${midSize}px`,
          clipPath,
          background: `linear-gradient(to top, ${midColor} 0%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
      {/* Top band */}
      <div
        ref={topRef}
        className="wedge-layer wedge-top"
        style={{
          ...basePos,
          width: `${topSize}px`,
          height: `${topSize}px`,
          clipPath,
          background: `linear-gradient(to top, ${topColor} 0%, rgba(255,255,255,0.1) 100%)`,
        }}
      />
    </>
  );
}


