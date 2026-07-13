import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getServerTranslations } from '@/lib/i18n/server'
import LoginForm from './LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/')

  const [{ error }, { t }] = await Promise.all([
    searchParams,
    getServerTranslations(),
  ])

  return (
    <div className="app-shell items-center justify-center px-5">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-brand-mid text-2xl font-black text-white"
                 style={{ boxShadow: "0 6px 24px rgba(61,122,86,0.42)" }}>
              L@
            </div>
            <h1 className="text-4xl font-black text-text-primary">{t("login.title")}</h1>
            <p className="mt-2 text-base text-text-secondary font-medium">{t("login.subtitle")}</p>
          </div>

          {error && (
            <p className="mb-6 w-full rounded-2xl bg-brand-accent/10 px-4 py-3 text-center text-sm text-brand-accent">
              {t("login.signInFailed")}
            </p>
          )}

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
