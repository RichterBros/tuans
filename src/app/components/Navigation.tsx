"use client";
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type NavLink = { name: string; href: string; external?: boolean }

const navLinks: NavLink[] = [
  { name: 'HOME', href: '/' },
  { name: 'SERVICES', href: '/services' },
  { name: 'ABOUT', href: '/about' },
  { name: 'REVIEWS', href: '/reviews' },
  { name: 'CONTACT', href: '/contact' },
  { name: 'BLOG', href: '/blog' },
]

const BASE_LOGO_WIDTH = 425

export default function Navigation() {
  const pathname = usePathname()
  const logoContainerRef = useRef<HTMLAnchorElement>(null)
  const sheenRef = useRef<HTMLDivElement>(null)
  

  useEffect(() => {
    const wrapper = logoContainerRef.current
    const sheen = sheenRef.current

    if (wrapper && sheen) {
      const handleMouseEnter = () => {
        wrapper.classList.add('hovered')
        sheen.style.left = '100%'
      }

      const handleMouseLeave = () => {
        wrapper.classList.remove('hovered')
        sheen.style.left = '-60%'
      }

      wrapper.addEventListener('mouseenter', handleMouseEnter)
      wrapper.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        wrapper.removeEventListener('mouseenter', handleMouseEnter)
        wrapper.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  

  return (
    <nav className="w-full bg-gradient-to-t from-red-900 via-red-900 to-black text-white py-4 px-2 flex flex-col items-center z-50 overflow-x-hidden" style={{ background: 'linear-gradient(to top, rgb(131, 136, 132) 0%, rgb(200, 205, 202) 35%, rgb(235, 237, 236) 100%)', position: 'relative', zIndex: 3000 }}>
      {/* Logo and Text Section */}
      <div className="relative flex items-center justify-center w-full max-w-6xl mx-auto gap-8 mb-4 md:mb-0 px-4 md:px-6">
                                                                       {/* Left Navigation Links - Hidden on mobile */}
           <div className="relative z-10 hidden md:flex gap-6">
             {navLinks.slice(0, 3).map((link) => (
               <a
                 key={link.name}
                 href={link.href}
                 target={link.external ? '_blank' : undefined}
                 rel={link.external ? 'noopener noreferrer' : undefined}
                 className={`uppercase font-bold tracking-widest text-sm transition-colors`}
                 style={{ color: pathname === link.href ? 'rgb(131, 136, 132)' : 'rgb(30, 46, 67)' }}
                 onMouseEnter={(e) => {
                   if (pathname !== link.href) {
                     e.currentTarget.style.color = 'rgb(131, 136, 132)';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (pathname !== link.href) {
                     e.currentTarget.style.color = 'rgb(30, 46, 67)';
                   }
                 }}
               >
                 {link.name}
               </a>
             ))}
           </div>

                    {/* Center Logo and Text */}
            <div className="relative z-10 flex flex-col items-center md:px-12">
              <div className="flex flex-col items-center gap-2">
                {/* Main logo */}
                <div className="relative flex items-center justify-center">
                  <a href="/" className="logo-container z-10 logo-scale-125 relative block" ref={logoContainerRef}>
                    <Image src="/tuan-logo-textv2 copy.png" alt="Tuans Auto Service" width={425} height={112} priority className="object-contain" />
                    <div className="masked-overlay">
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
                 target={link.external ? '_blank' : undefined}
                 rel={link.external ? 'noopener noreferrer' : undefined}
                 className={`uppercase font-bold tracking-widest text-sm transition-colors`}
                 style={{ color: pathname === link.href ? 'rgb(131, 136, 132)' : 'rgb(30, 46, 67)' }}
                 onMouseEnter={(e) => {
                   if (pathname !== link.href) {
                     e.currentTarget.style.color = 'rgb(131, 136, 132)';
                   }
                 }}
                 onMouseLeave={(e) => {
                   if (pathname !== link.href) {
                     e.currentTarget.style.color = 'rgb(30, 46, 67)';
                   }
                 }}
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
               target={link.external ? '_blank' : undefined}
               rel={link.external ? 'noopener noreferrer' : undefined}
               className={`uppercase font-bold tracking-widest text-sm transition-colors`}
               style={{ color: pathname === link.href ? 'rgb(131, 136, 132)' : 'rgb(30, 46, 67)' }}
               onMouseEnter={(e) => {
                 if (pathname !== link.href) {
                   e.currentTarget.style.color = 'rgb(131, 136, 132)';
                 }
               }}
               onMouseLeave={(e) => {
                 if (pathname !== link.href) {
                   e.currentTarget.style.color = 'rgb(30, 46, 67)';
                 }
               }}
             >
               {link.name}
             </a>
           ))}
         </div>
    </nav>
  )
} 