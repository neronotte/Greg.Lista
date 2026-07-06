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
      className="w-full py-3 bg-bg-surface text-error font-semibold text-base border-y border-border"
    >
      Esci
    </button>
  )
}
