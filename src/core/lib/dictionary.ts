"use server"
import { cookies } from "next/headers";
import { Dictionary, Locale } from "@/core/lib/dict";
import en from "@/core/dictionaries/en.json";
import fa from "@/core/dictionaries/fa.json";
import ar from "@/core/dictionaries/ar.json";

const dictionaries: Record<Locale, Dictionary> = { en, fa, ar };

export async function getDictionaryServer() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("locale")?.value;

  const lang = (
    langCookie && ["en", "fa", "ar"].includes(langCookie) ? langCookie : "fa"
  ) as Locale;

  const dictionary = dictionaries[lang] || dictionaries.fa;

  return { dictionary, lang };
}
