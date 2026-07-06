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
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-dark px-5">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white tracking-tight">List@</h1>
          <p className="mt-3 text-base text-white/70">La tua lista della spesa</p>
        </div>

        {error && (
          <p className="text-sm text-white/80 bg-white/10 rounded-lg px-4 py-3 w-full text-center">
            Accesso non riuscito. Riprova.
          </p>
        )}

        <LoginForm />
      </div>
    </main>
  )
}
