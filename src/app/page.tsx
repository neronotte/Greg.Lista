import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">List@</h1>
        <span className="text-sm text-gray-500">{user.email}</span>
      </header>
      <div className="p-4">
        <p className="text-gray-500 text-sm">Le tue liste appariranno qui.</p>
      </div>
    </main>
  )
}
