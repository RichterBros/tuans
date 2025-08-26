import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (process.env.REVALIDATE_TOKEN && token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ revalidated: false, message: 'Invalid token' }, { status: 401 })
  }
  const path = req.nextUrl.searchParams.get('path') || '/'
  try {
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  } catch (e) {
    return NextResponse.json({ revalidated: false, message: 'Error' }, { status: 500 })
  }
}


