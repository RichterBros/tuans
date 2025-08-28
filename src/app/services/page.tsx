"use client";
import React from 'react';
import Head from 'next/head';

export default function ServicesPage() {
  // Structured data for services
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Tuans Auto Service",
    "description": "Complete auto repair and maintenance services in Portland, OR. Oil changes, brake repair, engine diagnostics, transmission service, and more.",
    "url": "https://tuansautoservice.com/services",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1405 NE Killingsworth St",
      "addressLocality": "Portland",
      "addressRegion": "OR",
      "postalCode": "97211"
    },
    "telephone": "(503) 288-3927",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Auto Repair Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Oil Change Service"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Brake Repair"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Engine Diagnostics"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Transmission Service"
          }
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>Auto Repair Services Portland | Oil Change, Brake Repair, Engine Diagnostics | Tuans Auto Service</title>
        <meta name="description" content="Complete auto repair services in Portland, OR. Oil changes, brake repair, engine diagnostics, transmission service, and more. ASE certified mechanics. Call (503) 288-3927." />
        <meta name="keywords" content="auto repair Portland, oil change Portland, brake repair Portland, engine diagnostics Portland, transmission service Portland, ASE certified mechanic Portland" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Auto Repair Services Portland | Tuans Auto Service" />
        <meta property="og:description" content="Complete auto repair services in Portland, OR. Oil changes, brake repair, engine diagnostics, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tuansautoservice.com/services" />
        <meta property="og:image" content="/logo.png" />
        <link rel="canonical" href="https://tuansautoservice.com/services" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-no-repeat hero-zoom-in"
            style={{
              backgroundImage: "url('/impala.jpg')",
              backgroundPosition: 'center center',
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-70" />
          {/* Content */}
          <div className="relative z-10 text-center text-white hero-text-scale-down">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
              WE SERVICE ALL MAKES AND MODELS
            </h1>
            <p className="text-xl md:text-2xl font-semibold drop-shadow-lg">
              Fair Pricing And A Comprehensive Warranty On All Repairs
            </p>
          </div>
        </section>

        {/* Services Content Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Main Heading */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                We service all makes and models - import and domestic - of cars, trucks and SUVs... from oil changes to engine exchanges and everything in between.
              </h2>
            </div>

            {/* Three Column Services */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Column 1 - Left */}
              <div className="rounded-lg p-8 shadow-md border border-gray-200" style={{ background: 'linear-gradient(to top, rgba(255,222,0,0.2), #ffffff)' }}>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Basic Services</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Oil changes
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Fluid flushes
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    30, 60 and 90k services
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Belts and hoses
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Timing belts
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Water pumps
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Tires & wheels
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Auto electrical
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Emissions repair
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Air conditioning
                  </li>
                </ul>
              </div>

              {/* Column 2 - Middle */}
              <div className="rounded-lg p-8 shadow-md border border-gray-200" style={{ background: 'linear-gradient(to top, rgba(255,222,0,0.2), #ffffff)' }}>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Advanced Services</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Windows and locks
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Lighting
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Engine performance
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Brakes
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Shocks and struts
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Steering and suspension
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Manual transmissions
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Clutch
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Automatic transmission
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Welding and fabrication
                  </li>
                </ul>
              </div>

              {/* Column 3 - Right */}
              <div className="rounded-lg p-8 shadow-md border border-gray-200" style={{ background: 'linear-gradient(to top, rgba(255,222,0,0.2), #ffffff)' }}>
                <h3 className="text-xl font-bold text-gray-800 mb-6">Additional Services</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Towing available
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    Shuttle service within 10 miles
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2" style={{ color: 'rgb(74, 162, 192)' }}>•</span>
                    After hours key drop
                  </li>
                </ul>
              </div>
            </div>

            
          </div>
        </section>
      </div>
    </>
  )
} 