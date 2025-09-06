import React from 'react'
import { getBlogPostsPage, isContentfulConfigured } from '@/lib/contentful'

export default async function Head({ params }: { params: { page: string } }) {
  const pageNum = Number(params.page)
  const page = Number.isFinite(pageNum) && pageNum > 0 ? Math.floor(pageNum) : 1

  let totalPages = 0
  if (isContentfulConfigured()) {
    try {
      const { totalPages: tp } = await getBlogPostsPage({ page: 1, pageSize: 3 })
      totalPages = tp || 0
    } catch {
      totalPages = 0
    }
  }

  const base = 'https://tuansautoservice.com'
  const prevHref = page > 1 ? `${base}/blog/page/${page - 1}` : null
  const nextHref = totalPages > 0 && page < totalPages ? `${base}/blog/page/${page + 1}` : null

  return (
    <>
      {prevHref ? <link rel="prev" href={prevHref} /> : null}
      {nextHref ? <link rel="next" href={nextHref} /> : null}
    </>
  )
}


