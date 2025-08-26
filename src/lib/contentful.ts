/*
  Lightweight Contentful CDA helper used by the blog pages.

  Notes
  - Safe to run without env vars: returns empty results instead of throwing
  - Avoids extra dependencies; handles basic Asset resolution for hero image
*/

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: string
  bodyDocument?: RichTextDocument
  publishedAt?: string
  heroImageUrl?: string
}

// Minimal Rich Text types to avoid external dependency
export type RichTextMark = { type: string }
export type RichTextNode = {
  nodeType: string
  value?: string
  marks?: RichTextMark[]
  data?: any
  content?: RichTextNode[]
}
export type RichTextDocument = {
  nodeType: 'document'
  content: RichTextNode[]
}

type ContentfulSys = { id: string; type: string }

type ContentfulEntry<TFields extends Record<string, unknown>> = {
  sys: ContentfulSys
  fields: TFields
}

type ContentfulAsset = {
  sys: ContentfulSys
  fields?: { file?: { url?: string } }
}

type ContentfulCollection<T> = {
  items: T[]
  includes?: { Asset?: ContentfulAsset[] }
  total: number
  skip: number
  limit: number
}

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN
const CONTENTFUL_PREVIEW_ACCESS_TOKEN = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
const CONTENTFUL_BLOGPOST_TYPE_ID = process.env.CONTENTFUL_BLOGPOST_TYPE_ID || 'blogPost'
const CONTENTFUL_BLOGPOST_DATE_FIELD = process.env.CONTENTFUL_BLOGPOST_DATE_FIELD || 'date'

export function isContentfulConfigured(): boolean {
  return Boolean(CONTENTFUL_SPACE_ID && CONTENTFUL_ACCESS_TOKEN)
}

class ContentfulError extends Error {
  status: number
  details?: unknown
  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

async function contentfulFetch<T>({
  path,
  searchParams,
  preview,
}: {
  path: string
  searchParams?: Record<string, string | number | boolean | undefined>
  preview?: boolean
}): Promise<T> {
  const base = preview ? 'https://preview.contentful.com' : 'https://cdn.contentful.com'
  const token = preview && CONTENTFUL_PREVIEW_ACCESS_TOKEN ? CONTENTFUL_PREVIEW_ACCESS_TOKEN : CONTENTFUL_ACCESS_TOKEN

  const url = new URL(
    `${base}/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}${path}`
  )
  const params = new URLSearchParams()
  params.set('access_token', String(token))
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) params.set(key, String(value))
    })
  }
  url.search = params.toString()

  const res = await fetch(url.toString(), { next: { revalidate: 60 } })
  if (!res.ok) {
    let details: unknown = undefined
    try {
      details = await res.json()
    } catch {
      try {
        details = await res.text()
      } catch {
        details = undefined
      }
    }
    const message = `Contentful request failed: ${res.status} ${res.statusText}`
    throw new ContentfulError(message, res.status, details)
  }
  return (await res.json()) as T
}

function resolveHeroImageUrl(entry: ContentfulEntry<Record<string, unknown>>, includes?: { Asset?: ContentfulAsset[] }): string | undefined {
  // Try common field names that may hold an Asset link
  const candidateFieldNames = ['heroImage', 'image', 'coverImage', 'featuredImage']
  const assets = includes?.Asset || []

  for (const fieldName of candidateFieldNames) {
    const value = entry.fields[fieldName]
    if (value && typeof value === 'object' && (value as any).sys && (value as any).sys.type === 'Link') {
      const targetId = (value as any).sys.id as string | undefined
      const asset = assets.find(a => a.sys.id === targetId)
      const url = asset?.fields?.file?.url
      if (url) return url.startsWith('http') ? url : `https:${url}`
    }
  }

  return undefined
}

function mapEntryToBlogPost(entry: ContentfulEntry<Record<string, unknown>>, includes?: { Asset?: ContentfulAsset[] }): BlogPost | null {
  const id = entry.sys.id
  const fields = entry.fields

  const title = (fields['title'] as string) || ''
  const slug = (fields['slug'] as string) || ''
  if (!title || !slug) return null

  const excerpt = (fields['excerpt'] as string) || (fields['description'] as string) || undefined
  const bodyField = (fields['content'] as unknown) || (fields['body'] as unknown)
  const body = typeof bodyField === 'string' ? bodyField : undefined
  const bodyDocument =
    bodyField && typeof bodyField === 'object' && (bodyField as any).nodeType === 'document'
      ? (bodyField as RichTextDocument)
      : undefined
  const publishedAt = (fields['date'] as string) || (fields['publishedAt'] as string) || undefined
  const heroImageUrl = resolveHeroImageUrl(entry, includes)

  return { id, title, slug, excerpt, body, bodyDocument, publishedAt, heroImageUrl }
}

export async function getAllBlogPosts({ limit = 20, preview = false }: { limit?: number; preview?: boolean } = {}): Promise<BlogPost[]> {
  if (!isContentfulConfigured()) return []

  // Assumes content_type ID is 'blogPost'. Adjust as needed.
  // Try ordering by configured date field; if rejected (e.g., field missing), fall back to createdAt
  let data: ContentfulCollection<ContentfulEntry<Record<string, unknown>>> | null = null
  try {
    data = await contentfulFetch<ContentfulCollection<ContentfulEntry<Record<string, unknown>>>>({
      path: '/entries',
      searchParams: {
        content_type: CONTENTFUL_BLOGPOST_TYPE_ID,
        order: `-fields.${CONTENTFUL_BLOGPOST_DATE_FIELD}`,
        limit,
        include: 2,
      },
      preview,
    })
  } catch (err) {
    const isBadRequest = err instanceof ContentfulError && err.status === 400
    if (!isBadRequest) throw err
    data = await contentfulFetch<ContentfulCollection<ContentfulEntry<Record<string, unknown>>>>({
      path: '/entries',
      searchParams: {
        content_type: CONTENTFUL_BLOGPOST_TYPE_ID,
        order: '-sys.createdAt',
        limit,
        include: 2,
      },
      preview,
    })
  }

  const posts: BlogPost[] = []
  for (const item of data.items) {
    const mapped = mapEntryToBlogPost(item, data.includes)
    if (mapped) posts.push(mapped)
  }
  return posts
}

export async function getBlogPostBySlug(slug: string, { preview = false }: { preview?: boolean } = {}): Promise<BlogPost | null> {
  if (!isContentfulConfigured()) return null

  const data = await contentfulFetch<ContentfulCollection<ContentfulEntry<Record<string, unknown>>>>({
    path: '/entries',
    searchParams: {
      content_type: CONTENTFUL_BLOGPOST_TYPE_ID,
      'fields.slug': slug,
      limit: 1,
      include: 2,
    },
    preview,
  })

  const entry = data.items[0]
  if (!entry) return null
  return mapEntryToBlogPost(entry, data.includes)
}

export async function getBlogPostsPage({
  page = 1,
  pageSize = 5,
  preview = false,
}: {
  page?: number
  pageSize?: number
  preview?: boolean
}): Promise<{ posts: BlogPost[]; total: number; page: number; pageSize: number; totalPages: number }> {
  if (!isContentfulConfigured()) return { posts: [], total: 0, page, pageSize, totalPages: 0 }

  const safePage = Math.max(1, Math.floor(page))
  const safeSize = Math.max(1, Math.min(50, Math.floor(pageSize)))
  const skip = (safePage - 1) * safeSize

  let data: ContentfulCollection<ContentfulEntry<Record<string, unknown>>> | null = null
  try {
    data = await contentfulFetch<ContentfulCollection<ContentfulEntry<Record<string, unknown>>>>({
      path: '/entries',
      searchParams: {
        content_type: CONTENTFUL_BLOGPOST_TYPE_ID,
        order: `-fields.${CONTENTFUL_BLOGPOST_DATE_FIELD}`,
        limit: safeSize,
        skip,
        include: 2,
      },
      preview,
    })
  } catch (err) {
    const isBadRequest = err instanceof ContentfulError && err.status === 400
    if (!isBadRequest) throw err
    data = await contentfulFetch<ContentfulCollection<ContentfulEntry<Record<string, unknown>>>>({
      path: '/entries',
      searchParams: {
        content_type: CONTENTFUL_BLOGPOST_TYPE_ID,
        order: '-sys.createdAt',
        limit: safeSize,
        skip,
        include: 2,
      },
      preview,
    })
  }

  const posts: BlogPost[] = []
  for (const item of data.items) {
    const mapped = mapEntryToBlogPost(item, data.includes)
    if (mapped) posts.push(mapped)
  }

  const totalPages = Math.max(0, Math.ceil((data.total || 0) / safeSize))
  return { posts, total: data.total || 0, page: safePage, pageSize: safeSize, totalPages }
}


