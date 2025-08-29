"use client";
import { useLayoutEffect } from 'react'

export default function HydrationGuard() {
  useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('hydrated')
    }
  }, [])
  return null
}


