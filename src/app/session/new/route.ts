import { startSession } from '@/lib/actions/sessions'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const listId = request.nextUrl.searchParams.get('listId')
  if (!listId) return new Response('Missing listId', { status: 400 })
  // startSession already redirects
  await startSession(listId)
  return new Response(null, { status: 302, headers: { Location: '/' } })
}
