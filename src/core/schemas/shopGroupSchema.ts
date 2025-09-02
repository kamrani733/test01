import { Dictionary } from "@/core/lib/dict";
import { z } from "zod";

export const getShopGroupFormSchema = (dictionary: Dictionary) =>
  z.object({
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    description: z.string().optional().nullable(),
    title_en: z.string().optional().nullable(),
    title_ar: z.string().optional().nullable(),
    description_en: z.string().optional().nullable(),
    description_ar: z.string().optional().nullable(),
    meta: z.array(
      z.object({
        name: z.string().min(1, {
          message: dictionary.forms.name + " " + dictionary.errors.required,
        }),
        title: z.string().min(1, {
          message: dictionary.forms.title + " " + dictionary.errors.required,
        }),
        title_en: z.string().optional().nullable(),
        title_ar: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        description_en: z.string().optional().nullable(),
        description_ar: z.string().optional().nullable(),
        priority: z.number().min(1, {
          message: dictionary.forms.priority + " " + dictionary.errors.required,
        }),
      })
    ),
  });

export type ShopGroupFormData = z.infer<
  ReturnType<typeof getShopGroupFormSchema>
>;
