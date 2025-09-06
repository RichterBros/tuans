import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import Image from 'next/image'
import HydrationGuard from './components/HydrationGuard'
import Navigation from './components/Navigation'
import WedgeStack from './components/WedgeStack'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tuans Auto Services',
  description: 'Professional automobile repair services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body className={inter.className + ' bg-black overflow-x-hidden'}>
        <HydrationGuard />
        {/* AngleCut corner wedges */}
        {/* Original wedges disabled */}
        <div className="anglecut-wedge anglecut-wedge-tl" style={{ zIndex: 101, display: 'none' }} />
        <div className="anglecut-wedge anglecut-wedge-br" style={{ zIndex: 101, display: 'none' }} />
        {/* Three separate layered wedges at the exact top-left baseline position */}
        <WedgeStack enableParallax={true} topSize={120} gap={60} position="tl" topColor="#fff4b3" midColor="#ffdf32" botColor="#ffb700" />
        <WedgeStack enableParallax={true} topSize={120} gap={60} position="br" topColor="#fff4b3" midColor="#ffdf32" botColor="#ffb700" />
        {/* Remove previous large copies now that band pattern is in place */}
        
        
        <Navigation />
        <main className="site-content overflow-x-hidden">{children}</main>
        
        {/* Footer Section */}
        <footer style={{ backgroundColor: 'rgb(30, 46, 67)', position: 'relative', zIndex: 2500 }}>
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex justify-center">
                <div className="flex flex-col lg:flex-row gap-12 max-w-4xl w-full">
                  {/* Left Side - Certifications and Ratings */}
                  <div className="w-full lg:w-1/2">
                    <div className="space-y-6">
                      {/* ASE Certified */}
                      <div className="flex items-center gap-4">
                        <Image src="/ase-certified.png" alt="ASE Certified" width={120} height={120} />
                        <div style={{ color: 'rgb(74, 162, 192)' }}>
                          <p className="text-sm font-semibold">AUTOMOTIVE</p>
                          <p className="text-sm font-semibold">SERVICE EXCELLENCE</p>
                        </div>
                      </div>
                      
                      {/* A+ Rating and BBB Accredited */}
                      <div className="flex items-center gap-2">
                        <Image src="/BBB-rating-logo.png" alt="BBB Rating" width={300} height={300} />
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Business Info and Map */}
                  <div className="w-full lg:w-1/2">
                    <div className="space-y-6">
                      {/* Business Information */}
                      <div style={{ color: 'rgb(74, 162, 192)' }}>
                        <h3 className="text-xl font-bold mb-2">Tuans Auto Service</h3>
                        <p className="text-sm mb-2">FULL SERVICE AUTO REPAIR AND MAINTENANCE</p>
                        <p className="text-sm mb-2">1405 NE Killingsworth St
                        Portland, OR 97211</p>
                        <p className="text-sm mb-4">Call to schedule: <span className="font-bold">(503) 288-3927</span></p>
                        <div className="text-sm">
                          <p>Mon-Fri: 8:30 am - 5:00 pm</p>
                          <p>Sat-Sun: Closed</p>
                        </div>
                      </div>
                      
                                             {/* Map Placeholder */}
                                               <div className="relative">
                          <a 
                            href="https://www.google.com/maps/place/Tuans+Auto+Services/@45.5636394,-122.657723,15z/data=!4m16!1m7!3m6!1s0x5495a71ddd2f4d51:0x6a1ab02e837f0ab9!2sTuans+Auto+Services!8m2!3d45.5630282!4d-122.6508855!16s%2Fg%2F1tdbkq2y!3m7!1s0x5495a71ddd2f4d51:0x6a1ab02e837f0ab9!8m2!3d45.5630282!4d-122.6508855!9m1!1b1!16s%2Fg%2F1tdbkq2y?entry=ttu&g_ep=EgoyMDI1MDcyOS4wIKXMDSoASAFQAw%3D%3D" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full h-48 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                          >
                            <Image 
                              src="/map-placeholder.jpg" 
                              alt="Tuans Auto Service Location Map" 
                              width={800} height={192}
                              className="w-full h-48 object-cover"
                            />
                          </a>
                          <a 
                            href="https://www.google.com/maps/place/Tuans+Auto+Services/@45.5636394,-122.657723,15z/data=!4m16!1m7!3m6!1s0x5495a71ddd2f4d51:0x6a1ab02e837f0ab9!2sTuans+Auto+Services!8m2!3d45.5630282!4d-122.6508855!16s%2Fg%2F1tdbkq2y!3m7!1s0x5495a71ddd2f4d51:0x6a1ab02e837f0ab9!8m2!3d45.5630282!4d-122.6508855!9m1!1b1!16s%2Fg%2F1tdbkq2y?entry=ttu&g_ep=EgoyMDI1MDcyOS4wIKXMDSoASAFQAw%3D%3D" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded hover:bg-opacity-90 transition-colors"
                          >
                            View larger map
                          </a>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation Bar */}
          <div style={{ backgroundColor: 'rgb(30, 46, 67)' }}>
            {/* Light Grey Navigation Links Bar */}
            <div className="py-4" style={{ backgroundColor: 'rgb(200, 205, 202)' }}>
              <div className="container mx-auto px-4">
                                 <div className="flex flex-wrap gap-2 md:gap-20 text-[10px] md:text-base font-semibold justify-center" style={{ color: 'rgb(30, 46, 67)' }}>
                   <a href="/" className="hover:text-gray-400">HOME</a>
                   <a href="/services" className="hover:text-gray-400">SERVICES</a>
                   <a href="/about" className="hover:text-gray-400">ABOUT</a>
                   <a href="/reviews" className="hover:text-gray-400">REVIEWS</a>
                   <a href="/contact" className="hover:text-gray-400">CONTACT</a>
                   <a href="/blog/page/1" className="hover:text-gray-400">BLOG</a>
                 </div>
              </div>
            </div>
            
            {/* Social Bar (icons removed) */}
            <div className="py-4">
              <div className="container mx-auto px-4">
                <div className="flex justify-center">
                  <div className="text-sm" style={{ color: 'rgb(74, 162, 192)' }}>
                    <span>© 2025 Tuans Automotive. All rights reserved. // Site by Richter Bros. Media</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 