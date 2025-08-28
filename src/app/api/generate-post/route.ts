import { NextRequest, NextResponse } from 'next/server'

type GeneratePayload = {
  topic?: string
  publish?: boolean
}

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const ENV_ID = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const CRON_TOKEN = process.env.CRON_TOKEN
const CONTENT_TYPE_ID = process.env.CONTENTFUL_BLOGPOST_TYPE_ID || 'blogPost'
const DEFAULT_LOCALE = 'en-US'
const IMAGE_FIELD_CANDIDATES = ['heroImage', 'image', 'coverImage', 'featuredImage']

function isConfigured(): boolean {
  return Boolean(SPACE_ID && ENV_ID && CMA_TOKEN && OPENAI_API_KEY)
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function generateWithOpenAI(topic?: string): Promise<{ title: string; excerpt: string; contentHtml: string }> {
  const prompt = [
    'You are writing for a local auto repair shop in Portland, OR (Tuans Auto Service).',
    `Write a 700-900 word, accurate, practical blog post about: ${topic || 'Everyday car care tips for Portland drivers'}.`,
    'Audience: everyday car owners, non-technical. Tone: friendly, helpful, professional.',
    'Output HTML only. Use <h2>/<h3>, <p>, <ul>/<li>, and short paragraphs.',
    'Start with a 1-2 sentence summary. End with a short safety disclaimer and a call to action to contact Tuans Auto Service.',
  ].join('\n')

  const sysPrompt = 'Return a compact JSON object with keys: title, excerpt, contentHtml. Do not include markdown fences.'

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`OpenAI request failed: ${res.status} ${res.statusText} ${text}`)
  }
  const data = (await res.json()) as any
  const content = data?.choices?.[0]?.message?.content || ''
  let parsed: { title?: string; excerpt?: string; contentHtml?: string } = {}
  try {
    parsed = JSON.parse(content)
  } catch {
    // Fallback: derive simple title/excerpt
    const fallbackTitle = topic ? `${topic} — Tips and Tricks` : 'Car Care Tips for Portland Drivers'
    const excerpt = 'Practical, local tips to keep your vehicle running safely and efficiently.'
    parsed = { title: fallbackTitle, excerpt, contentHtml: String(content || '') }
  }
  if (!parsed.title) parsed.title = topic ? `${topic} — Tips and Tricks` : 'Car Care Tips for Portland Drivers'
  if (!parsed.excerpt) parsed.excerpt = 'Practical, local tips to keep your vehicle running safely and efficiently.'
  if (!parsed.contentHtml) parsed.contentHtml = '<p>No content generated.</p>'
  return { title: parsed.title, excerpt: parsed.excerpt, contentHtml: parsed.contentHtml }
}

async function generateImageWithOpenAI({
  topic,
  title,
}: {
  topic?: string
  title: string
}): Promise<{ buffer: Buffer; contentType: string; fileName: string; altText: string } | null> {
  try {
    const basePrompt = [
      'Create a friendly, simplified cartoon illustration for a car-care blog.',
      'Scene: an oil dipstick and a small oil can near an engine bay. Light, clean shapes.',
      'Style: flat, vibrant, playful blog illustration. Soft shadows. No photorealism.',
      'Strictly no text, letters, numbers, logos, watermarks, or signage in the image.',
      'The composition should clearly reflect the main idea conveyed by the blog post title.',
      'Emphasize the key nouns from the title using simple, recognizable shapes.',
    ]
    const topicLine = topic ? `Topic: ${topic}.` : ''
    const titleLine = title ? `Post title: ${title}.` : ''

    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: [basePrompt.join(' '), topicLine, titleLine].filter(Boolean).join(' '),
        size: '1792x1024',
        response_format: 'b64_json',
        // Emphasize no text
        // Note: OpenAI may still render text occasionally; we enforce with prompt only
      }),
    })

    if (!res.ok) {
      return null
    }
    const data = (await res.json()) as any
    const b64 = data?.data?.[0]?.b64_json
    if (!b64) return null
    const buffer = Buffer.from(b64, 'base64')
    const contentType = 'image/png'
    const safeSlug = slugify(title).slice(0, 60) || 'blog-illustration'
    const fileName = `${safeSlug}.png`
    const altText = `${title} — illustration`
    return { buffer, contentType, fileName, altText }
  } catch {
    return null
  }
}

async function uploadImageToContentful({
  buffer,
  contentType,
}: {
  buffer: Buffer
  contentType: string
}): Promise<string> {
  const uploadRes = await fetch(
    `https://upload.contentful.com/spaces/${SPACE_ID}/uploads`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CMA_TOKEN}`,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    }
  )
  if (!uploadRes.ok) {
    const text = await uploadRes.text().catch(() => '')
    throw new Error(`Contentful upload failed: ${uploadRes.status} ${uploadRes.statusText} ${text}`)
  }
  const json = (await uploadRes.json()) as any
  const id = json?.sys?.id
  if (!id) throw new Error('Contentful upload: missing id')
  return id
}

async function createProcessPublishAsset({
  uploadId,
  fileName,
  contentType,
  title,
  description,
}: {
  uploadId: string
  fileName: string
  contentType: string
  title: string
  description?: string
}): Promise<{ assetId: string; version: number }> {
  // Create Asset referencing the upload
  const createRes = await fetch(
    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}/assets`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CMA_TOKEN}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
      },
      body: JSON.stringify({
        fields: {
          title: { [DEFAULT_LOCALE]: title },
          description: description ? { [DEFAULT_LOCALE]: description } : undefined,
          file: {
            [DEFAULT_LOCALE]: {
              fileName,
              contentType,
              uploadFrom: {
                sys: { type: 'Link', linkType: 'Upload', id: uploadId },
              },
            },
          },
        },
      }),
    }
  )
  if (!createRes.ok) {
    const text = await createRes.text().catch(() => '')
    throw new Error(`Contentful asset create failed: ${createRes.status} ${createRes.statusText} ${text}`)
  }
  const created = (await createRes.json()) as any
  let assetId: string = created?.sys?.id
  let version: number = created?.sys?.version

  // Start processing
  const processRes = await fetch(
    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}/assets/${assetId}/files/${DEFAULT_LOCALE}/process`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${CMA_TOKEN}`,
        'X-Contentful-Version': String(version ?? 1),
      },
    }
  )
  if (!processRes.ok) {
    const text = await processRes.text().catch(() => '')
    throw new Error(`Contentful asset process failed: ${processRes.status} ${processRes.statusText} ${text}`)
  }

  // Poll for processing completion
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
  for (let attempt = 0; attempt < 12; attempt++) {
    const getRes = await fetch(
      `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}/assets/${assetId}`,
      { headers: { Authorization: `Bearer ${CMA_TOKEN}` } }
    )
    if (!getRes.ok) {
      const text = await getRes.text().catch(() => '')
      throw new Error(`Contentful asset fetch failed: ${getRes.status} ${getRes.statusText} ${text}`)
    }
    const asset = (await getRes.json()) as any
    version = asset?.sys?.version ?? version
    const file = asset?.fields?.file?.[DEFAULT_LOCALE]
    const url = file?.url
    if (url) {
      // Publish
      const pubRes = await fetch(
        `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}/assets/${assetId}/published`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${CMA_TOKEN}`,
            'X-Contentful-Version': String(version ?? 1),
          },
        }
      )
      if (!pubRes.ok) {
        const text = await pubRes.text().catch(() => '')
        throw new Error(`Contentful asset publish failed: ${pubRes.status} ${pubRes.statusText} ${text}`)
      }
      const pub = (await pubRes.json()) as any
      version = pub?.sys?.version ?? version
      return { assetId, version }
    }
    await wait(1000)
  }
  throw new Error('Contentful asset processing timed out')
}

async function linkAssetToEntry({
  entryId,
  entryVersion,
  assetId,
  publish,
}: {
  entryId: string
  entryVersion: number
  assetId: string
  publish: boolean
}): Promise<number> {
  // Try candidate field names until one succeeds
  let lastError: string | null = null
  for (const fieldName of IMAGE_FIELD_CANDIDATES) {
    const updateRes = await fetch(
      `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}/entries/${entryId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${CMA_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Version': String(entryVersion),
        },
        body: JSON.stringify({
          fields: {
            [fieldName]: {
              [DEFAULT_LOCALE]: {
                sys: { type: 'Link', linkType: 'Asset', id: assetId },
              },
            },
          },
        }),
      }
    )
    if (updateRes.ok) {
      const updated = (await updateRes.json()) as any
      let newVersion: number = updated?.sys?.version
      if (publish) {
        const pubRes = await fetch(
          `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}/entries/${entryId}/published`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${CMA_TOKEN}`,
              'X-Contentful-Version': String(newVersion ?? 1),
            },
          }
        )
        if (!pubRes.ok) {
          const text = await pubRes.text().catch(() => '')
          throw new Error(`Contentful entry publish failed: ${pubRes.status} ${pubRes.statusText} ${text}`)
        }
        const pub = (await pubRes.json()) as any
        newVersion = pub?.sys?.version ?? newVersion
      }
      return newVersion
    } else {
      lastError = await updateRes.text().catch(() => `${updateRes.status} ${updateRes.statusText}`)
      // Try next field name
    }
  }
  throw new Error(`Failed to link asset to entry: ${lastError || 'no suitable image field'}`)
}

async function createEntryInContentful({
  title,
  slug,
  date,
  excerpt,
  contentHtml,
  publish,
}: {
  title: string
  slug: string
  date: string
  excerpt: string
  contentHtml: string
  publish: boolean
}): Promise<{ id: string; version: number }> {
  const createRes = await fetch(
    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}/entries`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CMA_TOKEN}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': CONTENT_TYPE_ID,
      },
      body: JSON.stringify({
        fields: {
          title: { [DEFAULT_LOCALE]: title },
          slug: { [DEFAULT_LOCALE]: slug },
          date: { [DEFAULT_LOCALE]: date },
          excerpt: { [DEFAULT_LOCALE]: excerpt },
          // Store HTML in long text field `content` if present in your model
          content: { [DEFAULT_LOCALE]: contentHtml },
        },
      }),
    }
  )
  if (!createRes.ok) {
    const text = await createRes.text().catch(() => '')
    throw new Error(`Contentful create failed: ${createRes.status} ${createRes.statusText} ${text}`)
  }
  const created = (await createRes.json()) as any
  let id: string = created?.sys?.id
  let version: number = created?.sys?.version

  if (publish) {
    const pubRes = await fetch(
      `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV_ID}/entries/${id}/published`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${CMA_TOKEN}`,
          'X-Contentful-Version': String(version ?? 1),
        },
      }
    )
    if (!pubRes.ok) {
      const text = await pubRes.text().catch(() => '')
      throw new Error(`Contentful publish failed: ${pubRes.status} ${pubRes.statusText} ${text}`)
    }
    const pub = (await pubRes.json()) as any
    version = pub?.sys?.version ?? version
  }

  return { id, version }
}

export async function POST(req: NextRequest) {
  try {
    if (!isConfigured()) {
      return NextResponse.json({ ok: false, error: 'Server not configured' }, { status: 500 })
    }

    const headerToken = (req.headers.get('x-cron-token') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '').trim()
    const urlToken = (req.nextUrl.searchParams.get('token') || '').trim()
    const expected = (CRON_TOKEN || '').trim()
    if (expected && headerToken !== expected && urlToken !== expected) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json().catch(() => ({}))) as GeneratePayload
    const topic = body.topic?.toString().slice(0, 140)
    const publish = Boolean(body.publish)

    const { title, excerpt, contentHtml } = await generateWithOpenAI(topic)
    const slug = slugify(title).slice(0, 80)
    const date = new Date().toISOString()

    const entry = await createEntryInContentful({ title, slug, date, excerpt, contentHtml, publish })

    // Attempt to generate and attach an image, but do not fail the whole request if it breaks
    let image: { assetId?: string } = {}
    try {
      const generated = await generateImageWithOpenAI({ topic, title })
      if (generated) {
        const uploadId = await uploadImageToContentful({ buffer: generated.buffer, contentType: generated.contentType })
        const asset = await createProcessPublishAsset({
          uploadId,
          fileName: generated.fileName,
          contentType: generated.contentType,
          title: generated.altText,
          description: 'AI-generated illustration for blog post',
        })
        await linkAssetToEntry({ entryId: entry.id, entryVersion: entry.version, assetId: asset.assetId, publish })
        image.assetId = asset.assetId
      }
    } catch (e) {
      // Swallow image errors; continue returning text success
    }

    return NextResponse.json({ ok: true, id: entry.id, slug, published: publish, image })
  } catch (err: unknown) {
    const message = (err as any)?.message || String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}



