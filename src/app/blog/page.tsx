import React from 'react'
import { redirect } from 'next/navigation'

export const revalidate = 60

export default function BlogIndexPage() {
  redirect('/blog/page/1')
}


