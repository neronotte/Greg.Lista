'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={signOut}
      className="w-full py-4 border-2 border-error/30 text-error rounded-2xl font-extrabold text-sm active:bg-red-50 transition-colors"
    >
      Sign Out
    </button>
  )
}
