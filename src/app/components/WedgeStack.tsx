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
  topSize = 120,
  gap = 60,
}: WedgeStackProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableParallax) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (topRef.current) topRef.current.style.transform = `translateY(${(y * 0.05).toFixed(0)}px)`;
      if (midRef.current) midRef.current.style.transform = `translateY(${(y * 0.10).toFixed(0)}px)`;
      if (botRef.current) botRef.current.style.transform = `translateY(${(y * 0.15).toFixed(0)}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enableParallax]);

  const midSize = topSize + gap;
  const botSize = topSize + gap * 2;

  return (
    <>
      <div
        ref={botRef}
        className="anglecut-wedge anglecut-wedge-tl"
        style={{ ["--wedge-size" as any]: `${botSize}px`, zIndex: 1000, borderTopColor: botColor }}
      />
      <div
        ref={midRef}
        className="anglecut-wedge anglecut-wedge-tl"
        style={{ ["--wedge-size" as any]: `${midSize}px`, zIndex: 1001, borderTopColor: midColor }}
      />
      <div
        ref={topRef}
        className="anglecut-wedge anglecut-wedge-tl"
        style={{ ["--wedge-size" as any]: `${topSize}px`, zIndex: 1002, borderTopColor: topColor }}
      />
    </>
  );
}


