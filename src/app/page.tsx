"use client";
import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const bgRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [overlayFadeOut, setOverlayFadeOut] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const topCardRef = useRef<HTMLDivElement>(null)
  const bottomCardRef = useRef<HTMLDivElement>(null)

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Tuans Auto Service",
    "description": "Trusted Portland auto repair shop with ASE certified mechanics. Honest pricing, same-day service for oil changes, brakes, engine repair and more.",
    "url": "https://tuansautoservice.com",
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "101"
    },
    "areaServed": {
      "@type": "City",
      "name": "Portland, OR"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "45.5152",
        "longitude": "-122.6784"
      },
      "geoRadius": "50000"
    }
  }

  useEffect(() => {
    // Trigger initial black overlay fade-out on mount
    const raf = requestAnimationFrame(() => setOverlayFadeOut(true))

    const handleScroll = () => {
      if (bgRef.current && videoRef.current) {
        // Parallax: move video at 40% of scroll speed, starting from -100px
        const offset = window.scrollY * 0.4
        // Keep video centered on smaller screens, apply parallax on larger screens
        const isSmallScreen = window.innerWidth < 1280
        if (isSmallScreen) {
          videoRef.current.style.transform = 'translateY(0px)'
        } else {
          videoRef.current.style.transform = `translateY(${-15 + offset * 0.9}px)`
        }
      }
      
      // Video restart logic
      if (videoRef.current) {
        const videoRect = videoRef.current.getBoundingClientRect()
        const isVideoVisible = videoRect.top < window.innerHeight && videoRect.bottom > 0
        
        if (isVideoVisible && hasPlayed) {
          // Video is visible again and has played before, restart it
          videoRef.current.currentTime = 0
          videoRef.current.play()
          setHasPlayed(false)
        }
      }
      
      // Fade-in animation on scroll
      const fadeElements = document.querySelectorAll('.fade-in-trigger, .fade-in-from-right, .fade-in-from-bottom')
      fadeElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.5
        if (isVisible) {
          element.classList.add('visible')
        }
      })
    }
    
    // Set initial position for mobile
    if (bgRef.current && videoRef.current && window.innerWidth < 1024) {
      videoRef.current.style.transform = 'translateY(0px)'
    }
    
    // Handle resize events
    const handleResize = () => {
      if (bgRef.current && videoRef.current) {
        const isSmallScreen = window.innerWidth < 1280
        if (isSmallScreen) {
          videoRef.current.style.transform = 'translateY(0px)'
        } else {
          videoRef.current.style.transform = 'translateY(0px)'
        }
      }
      // Keep the two cards heights in sync on resize
      if (topCardRef.current && bottomCardRef.current) {
        const topHeight = topCardRef.current.getBoundingClientRect().height
        bottomCardRef.current.style.minHeight = `${Math.ceil(topHeight)}px`
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    // Initial sync of card heights on mount and after images load
    const syncHeights = () => {
      if (topCardRef.current && bottomCardRef.current) {
        const topHeight = topCardRef.current.getBoundingClientRect().height
        bottomCardRef.current.style.minHeight = `${Math.ceil(topHeight)}px`
      }
    }
    const rafSync = requestAnimationFrame(syncHeights)
    const images = topCardRef.current?.querySelectorAll('img') || []
    const imageLoadHandlers: Array<() => void> = []
    images.forEach((img) => {
      if (!img.complete) {
        const onLoad = () => syncHeights()
        imageLoadHandlers.push(onLoad)
        img.addEventListener('load', onLoad)
      }
    })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(raf)
      cancelAnimationFrame(rafSync)
      images.forEach((img, idx) => {
        const handler = imageLoadHandlers[idx]
        if (handler) img.removeEventListener('load', handler)
      })
    }
  }, [hasPlayed])

  return (
    <>
      <Head>
        <title>Tuans Auto Service - Portland Auto Repair | ASE Certified Mechanics | (503) 288-3927</title>
        <meta name="description" content="Trusted Portland auto repair shop with ASE certified mechanics. Honest pricing, same-day service for oil changes, brakes, engine repair and more. Located at 1405 NE Killingsworth St, Portland, OR." />
        <meta name="keywords" content="Portland auto repair, Portland mechanic, ASE certified, oil change Portland, brake repair Portland, engine repair Portland, honest mechanic Portland" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Tuans Auto Service - Portland Auto Repair" />
        <meta property="og:description" content="Trusted Portland auto repair shop with ASE certified mechanics. Honest pricing, same-day service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tuansautoservice.com" />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tuans Auto Service - Portland Auto Repair" />
        <meta name="twitter:description" content="Trusted Portland auto repair shop with ASE certified mechanics." />
        <link rel="canonical" href="https://tuansautoservice.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>
      <main className="min-h-screen">
      {/* Fixed background video layer behind the entire page */}
      <div ref={bgRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: -2 }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('Video failed to load:', e);
          }}
        >
          <source src="/hero-video8.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Global dark gradient overlay over video */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.25))' }} />
      {/* Global black overlay fade on first load (matches hero) */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${overlayFadeOut ? 'opacity-0' : 'opacity-100'}`} style={{ zIndex: -1, backgroundColor: 'black' }} />
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[60vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg hero-heading-slide-in-right" style={{ color: 'rgb(74, 162, 192)' }}>
              Full Service Auto Repair and Maintenance
            </h1>
            <p className="text-lg md:text-xl mb-4 font-semibold drop-shadow-lg" style={{ color: 'rgb(74, 162, 192)' }}>
            1405 NE Killingsworth St Portland, OR 97211 <br /> Phone: (503) 288-3927
            </p>
            
            <a
              href="/contact"
              className="inline-block font-bold py-3 px-6 rounded shadow-lg text-lg transition-colors duration-200 mt-2"
              style={{ 
                backgroundColor: 'rgb(74, 162, 192)',
                color: 'rgb(30, 46, 67)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(226, 183, 87)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(74, 162, 192)';
              }}
            >
              Contact Us!
            </a>
          </div>
          {/* ASE Badge Placeholder */}
          <div className="flex-1 flex justify-center md:justify-end mt-8 md:mt-0">
            <div className="flex items-center justify-center">
              <img src="/ase-certified.png" alt="ASE Certified" width="150" height="150" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-16">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 28%, rgba(131,136,132,0) 0%, rgba(131,136,132,0) 30%, rgba(131,136,132,0.18) 55%, rgba(131,136,132,0.45) 78%, rgba(131,136,132,0.75) 100%)'
          }}
        />
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 leading-tight drop-shadow-lg text-center" style={{ color: 'rgb(74, 162, 192)' }}>Fair Pricing And A Comprehensive Warranty On All Repairs</h2>
          
        </div>
      </section>

      {/* Three Column Info Section */}
      <section className="py-16" style={{ background: 'linear-gradient(to right, rgb(63, 139, 165), rgb(74, 162, 192), rgb(63, 139, 165))' }}>
        <div className="container mx-auto px-4">
          <div ref={topCardRef} className="rounded-2xl shadow-lg p-6 md:p-10">
            <div className="grid md:grid-cols-3 gap-8">
            {/* Left Section - Repair and Maintenance */}
            <div className="text-center">
              <div className="mb-6">
                {/* Toyota Land Cruiser image */}
                <img 
                  src="/toyota-land-cruiser.png" 
                  alt="Toyota Land Cruiser - Repair and Maintenance" 
                  className="w-full h-48 object-cover rounded-lg mb-4 fade-in-trigger cursor-pointer hover:opacity-90 transition-opacity glow-magenta"
                  onClick={() => setSelectedImage("/toyota-land-cruiser.png")}
                />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(30, 46, 67)' }}>Repair and Maintenance</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgb(30, 46, 67)' }}>
                We service all makes and models - import and domestic - of cars, trucks and SUVs... from oil changes to engine exchanges and everything in between.
              </p>
            </div>

            {/* Middle Section - Family Owned and Operated */}
            <div className="text-center">
              <div className="mb-6">
                {/* Team image */}
                <img 
                  src="/team-placeholder copy.png" 
                  alt="Tuans Auto Service Team" 
                  className="w-full h-48 object-cover rounded-lg mb-4 fade-in-trigger delay-500 cursor-pointer hover:opacity-90 transition-opacity glow-magenta"
                  onClick={() => setSelectedImage("/team-placeholder copy.png")}
                />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(30, 46, 67)' }}>Family Owned and Operated</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgb(30, 46, 67)' }}>
                Complete auto repair and maintenance facility with 40 years combined experience caring for vehicles here in Portland since 1998.
              </p>
            </div>

            {/* Right Section - Business Hours */}
            <div className="text-center">
              <div className="mb-6">
                {/* Shop image */}
                <img 
                  src="/tuans-shop.png" 
                  alt="Tuans Auto Service Shop" 
                  className="w-full h-48 object-cover rounded-lg mb-4 fade-in-trigger delay-1000 cursor-pointer hover:opacity-90 transition-opacity glow-magenta"
                  onClick={() => setSelectedImage("/tuans-shop.png")}
                />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(30, 46, 67)' }}>Business Hours</h3>
              <div className="text-sm leading-relaxed" style={{ color: 'rgb(30, 46, 67)' }}>
                <p className="mb-2">Mon-Fri: 8:30 AM - 5:00 PM</p>
                <p className="mb-2">Sat-Sun: Closed</p>
                <p className="font-semibold">Call to schedule: (503) 288-3927</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Header Section */}
      <section className="pt-4 pb-8 -mt-10" style={{ background: 'linear-gradient(to right, rgb(63, 139, 165), rgb(74, 162, 192), rgb(63, 139, 165))' }}>
        <div className="container mx-auto px-4">
          <div ref={bottomCardRef} className="relative rounded-2xl shadow-lg p-6 md:p-10 overflow-hidden">
            {/* Background image fills card */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center fade-in-from-bottom"
                style={{ backgroundImage: "url('/Honda_Prelude_1978 copy.jpg')" }}
                onClick={() => setSelectedImage('/Honda_Prelude_1978 copy.jpg')}
              />
              {/* Gradient to keep left side readable - use brand light blue */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, rgba(74, 162, 192, 0.85), rgba(74, 162, 192, 0.6), rgba(74, 162, 192, 0))' }}
              />
            </div>
            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              {/* Left Side - Text */}
              <div className="flex-1 mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: 'rgb(30, 46, 67)' }}>
                  Classics, restoration, 4X4, offroad<br />
                  and performance upgrades and<br />
                  fabrication
                </h2>
              </div>
              {/* Right Side - Spacer to preserve layout on large screens */}
              <div className="hidden md:block flex-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Review Section */}
      <section className="py-16" style={{ background: 'linear-gradient(to bottom, rgb(131, 136, 132) 0%, rgb(200, 205, 202) 35%, rgb(235, 237, 236) 100%)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Quote Icon */}
            <div className="text-6xl mb-8" style={{ color: 'rgb(30, 46, 67)' }}>"</div>
            
            {/* Review Text */}
            <blockquote className="text-lg md:text-xl leading-relaxed mb-8 text-left" style={{ color: 'rgb(30, 46, 67)' }}>
            Located in the heart of Portland, OR, Tuans Auto Service stands out as a reliable destination for all your car repair needs. From routine maintenance to complex diagnostics, this auto repair shop offers a wide range of services to keep your vehicle running smoothly on the road. With a team of experienced technicians at the helm, you can trust that your car is in good hands when you bring it to Tuans Auto Service. <br /> <br />
            What sets Tuans Auto Service apart is their dedication to providing top-notch customer service alongside expert mechanical work. Whether you're dealing with a pesky check engine light or need a quick tune-up, the staff here is known for their friendly approach and willingness to go the extra mile for every customer. Next time your car needs attention, consider paying a visit to Tuans Auto Service for a seamless and stress-free experience.
            </blockquote>
            
            {/* Review Source */}
            {/*<p className="text-sm text-gray-600 mb-8">Review posted on hellophoenix.com</p>*/}
            
            {/* More Reviews Button */}
            <a 
              href="/reviews" 
              className="inline-block font-bold py-3 px-8 rounded-lg transition-colors duration-200"
              style={{ 
                backgroundColor: 'rgb(74, 162, 192)',
                color: 'rgb(30, 46, 67)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(226, 183, 87)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(74, 162, 192)';
              }}
            >
              More Reviews
            </a>
          </div>
        </div>
      </section>

    </main>

    {/* Image Modal */}
    {selectedImage && (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-4xl max-h-full">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-12 right-0 text-white text-4xl font-bold hover:text-gray-300 transition-colors z-10"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Enlarged view"
            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      </div>
    )}
    </>
  )
} 