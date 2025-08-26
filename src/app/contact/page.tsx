"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isRecaptchaEnabled = !!RECAPTCHA_SITE_KEY;

  // Structured data for contact page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "Tuans Auto Service",
    "description": "Contact Tuans Auto Service for all your automotive repair needs in Portland, OR. ASE certified mechanics, honest pricing, same-day service.",
    "url": "https://tuansautoservice.com/contact",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1405 NE Killingsworth St",
      "addressLocality": "Portland",
      "addressRegion": "OR",
      "postalCode": "97211"
    },
    "telephone": "(503) 288-3927",
    "openingHours": "Mo-Fr 08:30-17:00",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "(503) 288-3927",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": "English"
    }
  };

  // Load reCAPTCHA script
  useEffect(() => {
    if (!isRecaptchaEnabled) {
      setRecaptchaLoaded(false);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [RECAPTCHA_SITE_KEY, isRecaptchaEnabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let token: string | null = null;
      if (isRecaptchaEnabled && window.grecaptcha) {
        token = await window.grecaptcha.execute(String(RECAPTCHA_SITE_KEY), { action: 'contact_form' });
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({} as any));
        throw new Error(data?.error || 'Failed to send message');
      }

      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact Tuans Auto Service Portland | Call (503) 288-3927 | ASE Certified Mechanics</title>
        <meta name="description" content="Contact Tuans Auto Service in Portland, OR. ASE certified mechanics, honest pricing, same-day service. Call (503) 288-3927 or visit us at 1405 NE Killingsworth St." />
        <meta name="keywords" content="contact Tuans Auto Service Portland, auto repair Portland contact, mechanic Portland phone, ASE certified mechanic Portland contact" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Contact Tuans Auto Service Portland" />
        <meta property="og:description" content="Contact Tuans Auto Service in Portland, OR. ASE certified mechanics, honest pricing, same-day service." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tuansautoservice.com/contact" />
        <meta property="og:image" content="/logo.png" />
        <link rel="canonical" href="https://tuansautoservice.com/contact" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-black text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center slide-up-from-below">
            <h1 className="text-5xl font-extrabold tracking-widest mb-4">CONTACT US</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get in touch with us for all your automotive service needs
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column - Business Info and Map */}
            <div className="space-y-8">
              {/* Business Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Tuans Auto Service</h2>
                
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                  <span className="ml-2 text-gray-600">4.8 (101 reviews)</span>
                </div>
                
                
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact and Location</h3>
                <p className="text-gray-700 mb-6">
                  We welcome your call during business hours to schedule an appointment.
                </p>
                
                <div className="space-y-3">
                  <p className="text-gray-900">
                    <span className="font-semibold">Phone:</span> (503) 288-3927
                  </p>
                  <p className="text-gray-900">
                    <span className="font-semibold">Address:</span> 1405 NE Killingsworth St Portland, OR 97211
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">We're here for you:</h4>
                <div className="space-y-1 text-gray-700">
                  <p>Mon-Fri: 8:30 am - 5:30 pm</p>
                  <p>Saturdays: 8:30 am - 2:00 pm</p>
                  <p>Sundays: Closed</p>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Our Location</h4>
                <div className="rounded-lg overflow-hidden h-64">
                  <iframe
                    src="https://www.google.com/maps?q=1405+NE+Killingsworth+St,+Portland,+OR+97211&hl=en&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    aria-label="Map to 1405 NE Killingsworth St, Portland, OR 97211"
                  />
                </div>
                <div className="mt-2">
                  <a
                    href="https://www.google.com/maps?q=1405+NE+Killingsworth+St,+Portland,+OR+97211"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View larger map
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your phone number"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us about your automotive service needs..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || (isRecaptchaEnabled && !recaptchaLoaded)}
                    className={`font-bold py-3 px-8 rounded-lg transition-colors ${
                      isSubmitting || !recaptchaLoaded ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{ 
                      backgroundColor: isSubmitting || !recaptchaLoaded ? 'rgb(131, 136, 132)' : 'rgb(74, 162, 192)',
                      color: 'rgb(30, 46, 67)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting && (!isRecaptchaEnabled || recaptchaLoaded)) {
                        e.currentTarget.style.backgroundColor = 'rgb(226, 183, 87)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting && (!isRecaptchaEnabled || recaptchaLoaded)) {
                        e.currentTarget.style.backgroundColor = 'rgb(74, 162, 192)';
                      }
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>

                {/* reCAPTCHA Notice */}
                <div className="text-xs text-gray-500 mt-2">
                  This site is protected by reCAPTCHA and the Google{' '}
                  <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="https://policies.google.com/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  apply.
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
              <div className="mb-4" style={{ color: 'rgb(74, 162, 192)' }}>
                  <span className="material-symbols-outlined align-middle" style={{ fontSize: '40px', lineHeight: 1 }} aria-hidden>
                    call
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600">(503) 288-3927</p>
                <p className="text-sm text-gray-500">Available during business hours</p>
              </div>
              <div>
              <div className="mb-4" style={{ color: 'rgb(74, 162, 192)' }}>
                  <span className="material-symbols-outlined align-middle" style={{ fontSize: '40px', lineHeight: 1 }} aria-hidden>
                  home_pin
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600">1405 NE Killingsworth St</p>
                <p className="text-sm text-gray-500">Portland, OR 97211</p>
              </div>
              <div>
                <div className="mb-4" style={{ color: 'rgb(74, 162, 192)' }}>
                  <span className="material-symbols-outlined align-middle" style={{ fontSize: '40px', lineHeight: 1 }} aria-hidden>
                    nest_clock_farsight_analog
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-600">Mon-Fri: 8:30AM-5:30PM</p>
                <p className="text-sm text-gray-500">Sat: 8:00 am - 2:00 pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 