"use client";
import { useEffect, useLayoutEffect } from 'react'

export default function HydrationGuard() {
  useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('hydrated')
    }
  }, [])
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onLoad = () => document.documentElement.classList.add('ready')
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return () => window.removeEventListener('load', onLoad)
  }, [])
  return null
}


