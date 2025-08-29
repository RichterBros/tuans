import React from 'react'
import { getAllBlogPosts, getBlogPostBySlug, isContentfulConfigured } from '@/lib/contentful'
import type { RichTextDocument, RichTextNode, RichTextMark } from '@/lib/contentful'

export const revalidate = 60

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await getAllBlogPosts({ limit: 100 })
  return posts.map((p) => ({ slug: p.slug }))
}

// Inline typing prevents Netlify type mismatch
export default async function BlogPostPage(
  { params, searchParams }: { params: { slug: string }; searchParams: { [key: string]: string | string[] | undefined } }
) {
  const { slug } = params

  if (!isContentfulConfigured()) {
    return (
      <div className="container mx-auto px-4 py-12 text-white">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <p className="opacity-80">
          Contentful is not configured. Add your API keys to .env.local to enable the blog.
        </p>
      </div>
    )
  }

  const post = await getBlogPostBySlug(slug)
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-white">
        <h1 className="text-3xl font-bold mb-6">Post not found</h1>
        <p className="opacity-80">The requested post does not exist.</p>
      </div>
    )
  }

  return (
    <section
      className="w-full min-h-screen py-12"
      style={{
        background: 'linear-gradient(to bottom, rgb(0, 0, 0) 0%, rgb(131, 136, 132) 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <article className="mx-auto text-white px-4 md:px-6 max-w-[900px]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {post.publishedAt && (
            <p className="opacity-60 text-sm mt-2">
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          )}
        </header>

        {post.heroImageUrl && (
          <div className="mb-8 overflow-hidden card-angled">
            <img src={post.heroImageUrl} alt="" className="w-full max-h-[420px] object-cover" />
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          {post.bodyDocument ? (
            <RichTextRenderer document={post.bodyDocument as RichTextDocument} />
          ) : post.body ? (
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          ) : (
            <p className="opacity-80">No content.</p>
          )}
        </div>
      </article>
    </section>
  )
}

function RichTextRenderer({ document }: { document: RichTextDocument }) {
  return <div>{document.content.map((node, idx) => <Node key={idx} node={node} />)}</div>
}

function Node({ node }: { node: RichTextNode }) {
  const children = (node.content || []).map((c, i) => <Node key={i} node={c} />)

  switch (node.nodeType) {
    case 'paragraph':
      return <p>{children}</p>
    case 'heading-1':
      return <h1>{children}</h1>
    case 'heading-2':
      return <h2>{children}</h2>
    case 'heading-3':
      return <h3>{children}</h3>
    case 'unordered-list':
      return <ul>{children}</ul>
    case 'ordered-list':
      return <ol>{children}</ol>
    case 'list-item':
      return <li>{children}</li>
    case 'blockquote':
      return <blockquote>{children}</blockquote>
    case 'hyperlink': {
      const href = node.data?.uri || '#'
      return (
        <a href={href} className="underline" target="_blank" rel="noreferrer">
          {children}
        </a>
      )
    }
    case 'text': {
      const textValue: string = (node.value as string) ?? ''
      let el: React.ReactNode = textValue
      const marks: RichTextMark[] = Array.isArray(node.marks) ? (node.marks as RichTextMark[]) : []
      marks.forEach((m: RichTextMark) => {
        if (m.type === 'bold') el = <strong>{el}</strong>
        if (m.type === 'italic') el = <em>{el}</em>
        if (m.type === 'underline') el = <u>{el}</u>
        if (m.type === 'code') el = <code>{el}</code>
      })
      return <>{el}</>
    }
    default:
      return <>{children}</>
  }
}
