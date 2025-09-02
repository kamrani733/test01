export type Locale = "en" | "fa" | "ar";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  fa: () => import("../dictionaries/fa.json").then((module) => module.default),
  ar: () => import("../dictionaries/ar.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    return dictionaries.en();
  }
  return dictionaries[locale]();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
