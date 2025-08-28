"use client"

import React from 'react'

type ApiResult = {
  ok: boolean
  id?: string
  slug?: string
  published?: boolean
  image?: { assetId?: string }
  error?: string
}

export default function GenerateAdminPage() {
  const [topic, setTopic] = React.useState<string>("")
  const [publish, setPublish] = React.useState<boolean>(false)
  const [cronToken, setCronToken] = React.useState<string>("")
  const [revalidateToken, setRevalidateToken] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [result, setResult] = React.useState<ApiResult | null>(null)
  const [error, setError] = React.useState<string>("")

  React.useEffect(() => {
    try {
      const savedCron = window.localStorage.getItem("cronToken") || ""
      const savedReval = window.localStorage.getItem("revalidateToken") || ""
      if (savedCron) setCronToken(savedCron)
      if (savedReval) setRevalidateToken(savedReval)
    } catch {}
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setResult(null)

    try {
      // Persist tokens for convenience
      try {
        window.localStorage.setItem("cronToken", cronToken || "")
        window.localStorage.setItem("revalidateToken", revalidateToken || "")
      } catch {}

      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (cronToken) headers["x-cron-token"] = cronToken

      const query = cronToken ? `?token=${encodeURIComponent(cronToken)}` : ""
      const res = await fetch(`/api/generate-post${query}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ topic, publish }),
      })
      const data = (await res.json()) as ApiResult
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`)
      }
      setResult(data)

      // Optionally revalidate key paths
      if (revalidateToken) {
        const paths = ["/blog", "/blog/page/1"]; // basic index pages
        if (data.slug) paths.push(`/blog/${data.slug}`)
        await Promise.all(
          paths.map((p) =>
            fetch(`/api/revalidate?token=${encodeURIComponent(revalidateToken)}&path=${encodeURIComponent(p)}`, {
              method: "POST",
            }).catch(() => null)
          )
        )
      }
    } catch (err: unknown) {
      const message = (err as any)?.message || String(err)
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6">Generate Blog Post (Admin)</h1>
      <p className="opacity-80 mb-8">Enter a topic/prompt. The server will generate a title, body, and an illustration, then upload to Contentful.</p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block font-medium mb-2">Topic / Prompt</label>
          <textarea
            className="w-full bg-black/30 border border-white/20 rounded p-3 min-h-[120px]"
            placeholder="e.g., Oil change tips for winter in Portland"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="publish"
            type="checkbox"
            className="h-4 w-4"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          <label htmlFor="publish">Publish immediately</label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Cron Token (optional)</label>
            <input
              className="w-full bg-black/30 border border-white/20 rounded p-3"
              type="password"
              placeholder="Used for /api/generate-post if required"
              value={cronToken}
              onChange={(e) => setCronToken(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Revalidate Token (optional)</label>
            <input
              className="w-full bg-black/30 border border-white/20 rounded p-3"
              type="password"
              placeholder="Used for /api/revalidate after success"
              value={revalidateToken}
              onChange={(e) => setRevalidateToken(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded px-4 py-2"
        >
          {isSubmitting ? "Generating…" : "Generate"}
        </button>
      </form>

      {error ? (
        <div className="mt-8 text-red-400">{error}</div>
      ) : null}

      {result?.ok ? (
        <div className="mt-10 border border-white/15 rounded p-4 bg-white/5 max-w-2xl">
          <h2 className="text-xl font-semibold mb-2">Created</h2>
          <div className="text-sm opacity-80 space-y-1">
            <div><span className="opacity-60">Entry ID:</span> {result.id}</div>
            <div><span className="opacity-60">Slug:</span> {result.slug}</div>
            <div><span className="opacity-60">Published:</span> {String(result.published)}</div>
            {result.image?.assetId ? (
              <div><span className="opacity-60">Image Asset:</span> {result.image.assetId}</div>
            ) : null}
          </div>
          {result.slug ? (
            <a
              href={`/blog/${result.slug}`}
              className="inline-block mt-4 underline"
            >
              View post
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}


