"use client";
import React, { useEffect } from 'react'
import Head from 'next/head';

export default function About() {
  useEffect(() => {
    const handleScroll = () => {
      // Check if the shop exterior trigger is visible
      const triggerElement = document.getElementById('image-trigger')
      if (triggerElement) {
        const rect = triggerElement.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.5
        
                  if (isVisible) {
            // Trigger images with slight stagger
            const teamImageDesktop = document.getElementById('team-image-desktop')
            const teamImageMobile = document.getElementById('team-image-mobile')
            const shopImage = document.getElementById('image-trigger')
            const garageImage = document.getElementById('garage-image')
            
            // Shop image first (0ms delay)
            if (shopImage) shopImage.classList.add('visible')
            
            // Team image second (200ms delay) - handle both desktop and mobile
            setTimeout(() => {
              if (teamImageDesktop) teamImageDesktop.classList.add('visible')
              if (teamImageMobile) teamImageMobile.classList.add('visible')
            }, 200)
            
            // Garage image third (400ms delay)
            setTimeout(() => {
              if (garageImage) garageImage.classList.add('visible')
            }, 400)
          }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Structured data for about page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Tuans Auto Service",
    "description": "Learn about Tuans Auto Service - Portland's trusted auto repair shop with ASE certified mechanics. Family-owned business serving Portland since 1995 with honest pricing and quality service.",
    "url": "https://tuansautoservice.com/about",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1405 NE Killingsworth St",
      "addressLocality": "Portland",
      "addressRegion": "OR",
      "postalCode": "97211"
    },
    "telephone": "(503) 288-3927",
    "openingHours": "Mo-Fr 08:30-17:00",
    "priceRange": "$$",
    "foundingDate": "1995",
    "founder": {
      "@type": "Person",
      "name": "Tuan"
    },
    "employee": [
      {
        "@type": "Person",
        "name": "Tuan",
        "jobTitle": "Owner/Mechanic",
        "description": "ASE Certified Master Technician"
      }
    ]
  };

  return (
    <>
      <Head>
        <title>About Tuans Auto Service Portland | ASE Certified Mechanics Since 1995 | (503) 288-3927</title>
        <meta name="description" content="Learn about Tuans Auto Service - Portland's trusted auto repair shop with ASE certified mechanics. Family-owned business serving Portland since 1995 with honest pricing and quality service." />
        <meta name="keywords" content="about Tuans Auto Service Portland, ASE certified mechanic Portland, auto repair shop Portland, family owned mechanic Portland, honest mechanic Portland" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="About Tuans Auto Service Portland" />
        <meta property="og:description" content="Learn about Tuans Auto Service - Portland's trusted auto repair shop with ASE certified mechanics since 1995." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tuansautoservice.com/about" />
        <meta property="og:image" content="/logo.png" />
        <link rel="canonical" href="https://tuansautoservice.com/about" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>
      <main className="bg-gray-100">
        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-no-repeat hero-tilt-x-onload"
            style={{
              backgroundImage: "url('/engine-hero.jpg')",
              backgroundPosition: 'center center',
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-70" />
          {/* Content */}
          <div className="relative z-10 text-center text-white hero-text-scale-up">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
              ABOUT TUANS AUTO SERVICE
            </h1>
            <p className="text-xl md:text-2xl font-semibold drop-shadow-lg">
              Caring for vehicles since 1998
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="pt-16 pb-0 -mb-[150px] bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 lg:grid-rows-2 gap-12 max-w-6xl mx-auto">
              {/* Left Column - About Us (Top Row) */}
              <div className="space-y-6 lg:col-start-1 lg:row-start-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Tuans Auto Service Is Family Owned And Operated
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Complete auto repair and maintenance facility with 40 years combined experience caring for vehicles here in Portland since 1998.
                  </p>
                  
                  <p>
                    We service all makes and models - Import and domestic - of cars, trucks and SUVs... from oil changes to engine exchanges and everything in between.
                  </p>
                  
                  <p>
                    We also do classics, restoration, 4X4, offroad and performance upgrades and fabrication.
                  </p>
                  
                  <p>
                    We have the latest in automotive diagnostic equipment and expertise in air-conditioning, auto-electronics and vehicle emission requirements and repairs.
                  </p>
                </div>
                
                {/* Call to Action */}
                <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                  <p className="text-lg font-bold text-gray-800 text-center">
                    FULL SERVICE AUTO REPAIR AND MAINTENANCE
                  </p>
                  <p className="text-lg font-bold text-gray-800 text-center">
                    Call to schedule: (503) 288-3927
                  </p>
                </div>
                
              </div>

              {/* Right Column - Fair Pricing and Warranty (Top Row) */}
              <div className="space-y-6 lg:col-start-2 lg:row-start-1">
                
                
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Fair Pricing and a Comprehensive Warranty On All Repairs
                </h3>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We understand that your car is not only one of your biggest investments, but that its dependable operation is a critical part of your family's life. With that in mind, we have straightforward, fair pricing, a comprehensive warranty on all repairs and strive to interact with our customers as if they were members of our own family.
                  </p>
                </div>
                
                {/* Shop Exterior Image Placeholder - This is the trigger */}
                <div className="w-full h-[206px] bg-gray-300 rounded-lg flex items-center justify-center mb-4 fade-in-from-right mt-[17px]" id="image-trigger">
                  <span className="text-gray-600 text-sm">Shop Exterior with Red Sports Car</span>
                </div>
                
                {/* Team Image Placeholder - Shown on mobile, hidden on desktop */}
                <div className="block lg:hidden w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center fade-in-from-left" id="team-image-mobile">
                  <span className="text-gray-600 text-sm">Team Photo with Vintage Truck</span>
                </div>
              </div>

              {/* Bottom Row - Aligned Grey Boxes */}
              <div className="hidden lg:flex w-full h-64 bg-gray-300 rounded-lg items-center justify-center fade-in-from-left lg:col-start-1 lg:row-start-2" id="team-image-desktop">
                <span className="text-gray-600 text-sm">Team Photo with Vintage Truck</span>
              </div>
              <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center fade-in-from-right lg:col-start-2 lg:row-start-2" id="garage-image">
                <span className="text-gray-600 text-sm">Garage Interior with Orange Classic Car on Lift</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 