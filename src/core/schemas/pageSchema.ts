// src/schemas/pageSchema.ts
import { z } from "zod";
import { Dictionary } from "@/core/lib/dict";
import { PAGE_STATUSES } from "@/core/models/page-model";

export const getPageFormSchema = (dictionary: Dictionary) =>
  z.object({
    title: z.string().min(1, {
      message: `${dictionary.forms.title} ${dictionary.errors.required}`,
    }),
    title_en: z.string().optional().nullable(),
    title_ar: z.string().optional().nullable(),
    slug: z.string().min(1, {
      message: `${dictionary.forms.slug} ${dictionary.errors.required}`,
    }),
    status: z.enum(PAGE_STATUSES, {
      required_error: `${dictionary.forms.status} ${dictionary.errors.required}`,
    }),
    excerpt: z.string().optional().nullable(),
    excerpt_en: z.string().optional().nullable(),
    excerpt_ar: z.string().optional().nullable(),
    content: z.string().min(1, {
      message: `${dictionary.forms.content} ${dictionary.errors.required}`,
    }),
    content_en: z.string().optional().nullable(),
    content_ar: z.string().optional().nullable(),
    meta_title: z.string().optional().nullable(),
    meta_title_en: z.string().optional().nullable(),
    meta_title_ar: z.string().optional().nullable(),
    meta_keywords: z.string().optional().nullable(),
    meta_keywords_en: z.string().optional().nullable(),
    meta_keywords_ar: z.string().optional().nullable(),
    meta_description: z.string().optional().nullable(),
    meta_description_en: z.string().optional().nullable(),
    meta_description_ar: z.string().optional().nullable(),
  });

export type PageFormData = z.infer<ReturnType<typeof getPageFormSchema>>;
