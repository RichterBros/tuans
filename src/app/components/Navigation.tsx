"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from '/public/rz-logo-textv2.png';

type NavLink = { name: string; href: string; external?: boolean };

const navLinks: NavLink[] = [
  { name: "HOME", href: "/" },
  { name: "SERVICES", href: "/services" },
  { name: "ABOUT", href: "/about" },
  { name: "REVIEWS", href: "/reviews" },
  { name: "CONTACT", href: "/contact" },
  { name: "BLOG", href: "/blog" },
];

export default function Navigation() {
  const pathname = usePathname();
  const logoContainerRef = useRef<HTMLAnchorElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = logoContainerRef.current;
    const sheen = sheenRef.current;

    if (wrapper && sheen) {
      const handleMouseEnter = () => {
        wrapper.classList.add("hovered");
        sheen.style.left = "120%";
      };

      const handleMouseLeave = () => {
        wrapper.classList.remove("hovered");
        sheen.style.left = "-80%";
      };

      wrapper.addEventListener("mouseenter", handleMouseEnter);
      wrapper.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        wrapper.removeEventListener("mouseenter", handleMouseEnter);
        wrapper.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return (
    <nav
      className="w-full bg-gradient-to-t from-red-900 via-red-900 to-black text-white py-4 px-2 flex flex-col items-center z-50 overflow-x-hidden"
      style={{
        background:
          "linear-gradient(to top, rgb(0, 0, 0) 0%, rgb(127, 29, 29) 100%)",
        position: "relative",
        zIndex: 3000,
      }}
    >
      {/* Logo and Text Section */}
      <div className="relative flex items-center justify-center w-full max-w-6xl mx-auto gap-[55px] mb-4 md:mb-0 px-4 md:px-6">
        {/* Left Navigation Links - Hidden on mobile */}
        <div className="relative z-10 hidden md:flex gap-6">
          {navLinks.slice(0, 3).map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="uppercase font-bold tracking-widest text-[1.3125rem] text-white hover:text-gray-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Center Logo and Text */}
        <div className="relative z-10 flex flex-col items-center md:px-0">
          <div className="flex flex-col items-center gap-2">
            {/* Main logo */}
            <div className="relative flex items-center justify-center w-[150px] h-[150px]">
              <a
                href="/"
                className="logo-container z-10 logo-scale-100 relative block w-full h-full"
                ref={logoContainerRef}
              >
                <Image
                  src={logo} 
                  alt="Tuans Auto Service"
                  fill
                  priority={true}
                  
                  sizes="200px"
                />
                <div className="masked-overlay absolute inset-0">
                  <div className="sheen" ref={sheenRef}></div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Navigation Links - Hidden on mobile */}
        <div className="relative z-10 hidden md:flex gap-6">
          {navLinks.slice(3).map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="uppercase font-bold tracking-widest text-[1.3125rem] text-white hover:text-gray-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div className="flex flex-wrap gap-4 md:hidden justify-center">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="uppercase font-bold tracking-widest text-sm text-white hover:text-gray-400 transition-colors"
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
