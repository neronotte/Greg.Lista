import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/')

  const { error } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">List@</h1>
          <p className="mt-2 text-sm text-gray-500">La tua lista della spesa</p>
        </div>
        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">
            Accesso non riuscito. Riprova.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  )
}
