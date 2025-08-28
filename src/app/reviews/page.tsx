"use client";
import React from 'react';
import Head from 'next/head';

export default function ReviewsPage() {
  // Structured data for reviews page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Tuans Auto Service",
    "description": "Read customer reviews and testimonials for Tuans Auto Service in Portland, OR. 4.8-star rated ASE certified mechanics with honest pricing and quality service.",
    "url": "https://tuansautoservice.com/reviews",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1405 NE Killingsworth St",
      "addressLocality": "Portland",
      "addressRegion": "OR",
      "postalCode": "97211"
    },
    "telephone": "(503) 288-3927",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "101",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewBody": "Tuans Auto Service is hands down the best mechanic I've ever been to. They diagnosed my engine problem quickly and fixed it for a fair price. The staff is honest and professional. I'll definitely be back!"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Mike Chen"
        },
        "reviewBody": "Excellent service! They got my car in and out quickly, and the work was done right the first time. Fair pricing and honest communication throughout the process."
      }
    ]
  };

  const reviews = [
    {
      id: 1,
      text: "Tuans Auto Service is hands down the best mechanic I've ever been to. They diagnosed my engine problem quickly and fixed it for a fair price. The staff is honest and professional. I'll definitely be back!",
      author: "Sarah Johnson",
      location: "Portland, OR",
      source: "Google Reviews"
    },
    {
      id: 2,
      text: "Excellent service! They got my car in and out quickly, and the work was done right the first time. Fair pricing and honest communication throughout the process.",
      author: "Mike Chen",
      location: "Portland, OR",
      source: "Google Reviews"
    },
    {
      id: 3,
      text: "I've been taking my cars here for years and they never disappoint. Honest pricing, quality work, and great customer service. Highly recommend!",
      author: "David Rodriguez",
      location: "Portland, OR",
      source: "Google Reviews"
    },
    {
      id: 4,
      text: "Fast, reliable, and honest. They fixed my transmission issue that other shops couldn't figure out. Fair pricing and great communication.",
      author: "Lisa Thompson",
      location: "Portland, OR",
      source: "Google Reviews"
    },
    {
      id: 5,
      text: "Best auto repair shop in Portland! They're ASE certified, honest about what needs to be done, and always get the job done right. I trust them completely with my vehicle.",
      author: "Robert Wilson",
      location: "Portland, OR",
      source: "Google Reviews"
    },
    {
      id: 6,
      text: "Professional service from start to finish. They explained everything clearly and didn't try to upsell unnecessary repairs. My car runs better than ever!",
      author: "Jennifer Davis",
      location: "Portland, OR",
      source: "Google Reviews"
    },
    {
      id: 7,
      text: "Professional service from start to finish. They explained everything clearly and didn't try to upsell unnecessary repairs. My car runs better than ever!",
      author: "Jennifer Davis",
      location: "Portland, OR",
      source: "Google Reviews"
    },
    {
      id: 8,
      text: "Professional service from start to finish. They explained everything clearly and didn't try to upsell unnecessary repairs. My car runs better than ever!",
      author: "Jennifer Davis",
      location: "Portland, OR",
      source: "Google Reviews"
    }
  ];

  // Header animates immediately via CSS keyframes

  return (
    <>
      <Head>
        <title>Customer Reviews Portland | Tuans Auto Service | 4.8★ Rated ASE Certified Mechanics</title>
        <meta name="description" content="Read customer reviews for Tuans Auto Service in Portland, OR. 4.8-star rated ASE certified mechanics with honest pricing and quality auto repair service. Call (503) 288-3927." />
        <meta name="keywords" content="Tuans Auto Service reviews Portland, auto repair reviews Portland, mechanic reviews Portland, ASE certified mechanic reviews Portland" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Customer Reviews Portland | Tuans Auto Service" />
        <meta property="og:description" content="Read customer reviews for Tuans Auto Service in Portland, OR. 4.8-star rated ASE certified mechanics." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tuansautoservice.com/reviews" />
        <meta property="og:image" content="/logo.png" />
        <link rel="canonical" href="https://tuansautoservice.com/reviews" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-black text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center slide-up-from-below">
            <h1 className="text-5xl font-extrabold tracking-widest mb-4">CUSTOMER REVIEWS</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what our valued customers have to say about their experience with Tuans Auto Service
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="space-y-8">
            {/* First full-width review */}
            <div className="p-8 card-angled overflow-hidden" style={{ background: 'linear-gradient(to top, rgba(255,222,0,0.2), #ffffff)' }}>
              <div className="text-center mb-6">
                <div className="text-6xl text-gray-300 mb-4">"</div>
                <div className="flex justify-center mb-4">
                  <div className="flex text-yellow-400 text-2xl">
                    <span>★★★★</span>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  {reviews[0].text}
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{reviews[0].author}</p>
                <p className="text-gray-600">{reviews[0].location}</p>
              </div>
            </div>

            {/* Three-column section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(1, 4).map((review) => (
                <div key={review.id} className="p-6 card-angled overflow-hidden" style={{ background: 'linear-gradient(to top, rgba(255,222,0,0.2), #ffffff)' }}>
                  <div className="text-center mb-4">
                    <div className="text-4xl text-gray-300 mb-3">"</div>
                    <div className="flex justify-center mb-3">
                      <div className="flex text-yellow-400 text-lg">
                        <span>★★★★</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                  <div className="text-center">
                    {review.author && (
                      <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                    )}
                    {review.location && (
                      <p className="text-gray-600 text-sm">{review.location}</p>
                    )}
                    {review.source && (
                      <p className="text-gray-500 text-xs mt-1">{review.source}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

                        {/* Second full-width review */}
            <div className="p-8 card-angled overflow-hidden" style={{ background: 'linear-gradient(to top, rgba(255,222,0,0.2), #ffffff)' }}>
              <div className="text-center mb-6">
                <div className="text-6xl text-gray-300 mb-4">"</div>
                <div className="flex justify-center mb-4">
                  <div className="flex text-yellow-400 text-2xl">
                    <span>★★★★</span>
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  {reviews[4].text}
                </p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{reviews[4].author}</p>
                {reviews[4].location && (
                  <p className="text-gray-600">{reviews[4].location}</p>
                )}
                {reviews[4].source && (
                  <p className="text-gray-500 text-sm mt-1">{reviews[4].source}</p>
                )}
              </div>
            </div>

            {/* Second three-column section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(5, 8).map((review) => (
                <div key={review.id} className="p-6 card-angled overflow-hidden" style={{ background: 'linear-gradient(to top, rgba(255,222,0,0.2), #ffffff)' }}>
                  <div className="text-center mb-4">
                    <div className="text-4xl text-gray-300 mb-3">"</div>
                    <div className="flex justify-center mb-3">
                      <div className="flex text-yellow-400 text-lg">
                        <span>★★★★</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                  <div className="text-center">
                    {review.author && (
                      <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                    )}
                    {review.location && (
                      <p className="text-gray-600 text-sm">{review.location}</p>
                    )}
                    {review.source && (
                      <p className="text-gray-500 text-xs mt-1">{review.source}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

                 {/* Google Reviews CTA */}
         <div className="bg-gray-100 py-16">
           <div className="max-w-4xl mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold mb-4 text-gray-900">Read More Reviews on Google</h2>
             <p className="text-xl text-gray-600 mb-8">
               See what our customers are saying on Google Reviews. We're proud of our 4.8-star rating from over 100 satisfied customers.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.google.com/search?sca_esv=3d1e29cf7e253e0e&sxsrf=AE3TifMMmY80KX27jVgtwDGfiFEMvzp2yw:1754071508853&si=AMgyJEuzsz2NflaaWzrzdpjxXXRaJ2hfdMsbe_mSWso6src8s3laaL6cGY1EdG5rUpkMGEZ8u0zWPAg9F2ar_BxMO_noKfIlSWVp1y5iuVX_-qvEu4p5CfmDig_MZU9ut0_8XMaImOHJzrlugImdnJEcPONewS7Lww%3D%3D&q=Tuans+Auto+Services+Reviews&sa=X&ved=2ahUKEwj_osjJmeqOAxVCGBAIHYSmIMoQ0bkNegQINRAD&cshid=1754071582339652&biw=2048&bih=991&dpr=1.25"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold py-3 px-8 transition-colors inline-flex items-center gap-2 btn-angled"
                style={{ 
                  backgroundColor: 'rgb(74, 162, 192)',
                  color: 'rgb(30, 46, 67)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(226, 183, 87)';
                  const stars = e.currentTarget.querySelector('[data-stars="true"]') as HTMLElement | null;
                  if (stars) stars.style.color = 'rgb(30, 46, 67)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(74, 162, 192)';
                  const stars = e.currentTarget.querySelector('[data-stars="true"]') as HTMLElement | null;
                  if (stars) stars.style.color = 'rgb(226, 183, 87)';
                }}
              >
                <span data-stars="true" style={{ color: 'rgb(226, 183, 87)' }}>★★★★</span>
                <span>Read All Google Reviews</span>
              </a>
            
            </div>
           </div>
         </div>

         {/* Call to Action */}
         <div className="bg-black text-white py-16">
           <div className="max-w-4xl mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
             <p className="text-xl text-gray-300 mb-8">
               Join our satisfied customers and discover why Tuans Auto Service is the trusted choice for automotive care.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <a 
                 href="/contact" 
                 className="font-bold py-3 px-8 transition-colors btn-angled"
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
                 CONTACT US
               </a>
               <a 
                 href="/services" 
                 className="font-bold py-3 px-8 transition-colors btn-angled"
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
                 OUR SERVICES
               </a>
             </div>
           </div>
         </div>
      </div>
    </>
  );
} 