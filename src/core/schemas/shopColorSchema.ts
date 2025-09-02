import { Dictionary } from "@/core/lib/dict";
import { z } from "zod";

export const getShopColorSchema = (dictionary: Dictionary) =>
  z.object({
    code: z.string().min(1, {
      message: dictionary.forms.code + " " + dictionary.errors.required,
    }),
    code_hex: z.string().min(1, {
      message: dictionary.forms.code_hex + " " + dictionary.errors.required,
    }),
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    title_ar: z.string().optional().nullable(),
    title_en: z.string().optional().nullable(),
  });

export type ShopColorFormData = z.infer<ReturnType<typeof getShopColorSchema>>;
