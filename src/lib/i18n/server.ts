import { createClient } from "@/lib/supabase/server";
import { translations, t, type Locale } from "./translations";

type TranslationDict = typeof translations.en;

export async function getServerTranslations(): Promise<{
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
  translations: TranslationDict;
}> {
  let locale: Locale = "en";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("locale")
        .eq("id", user.id)
        .single();

      if (profile?.locale === "en" || profile?.locale === "it") {
        locale = profile.locale;
      }
    }
  } catch {
    // Use default locale on error
  }

  const currentTranslations = translations[locale] as typeof translations.en;

  return {
    locale,
    t: (key: string, vars?: Record<string, string | number>) =>
      t(currentTranslations, key, vars),
    translations: currentTranslations,
  };
}
