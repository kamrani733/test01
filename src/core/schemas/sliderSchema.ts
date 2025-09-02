import { Dictionary } from "@/core/lib/dict";
import { z } from "zod";

export const getSliderFormSchema = (dictionary: Dictionary) => {
  return z.object({
    title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    title_en: z.string().optional().nullable(),
    description_en: z.string().optional().nullable(),
    title_ar: z.string().optional().nullable(),
    description_ar: z.string().optional().nullable(),
    name: z.string().min(1, {
      message: dictionary.forms.name + " " + dictionary.errors.required,
    }),
    items: z.array(
      z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        title_en: z.string().optional().nullable(),
        description_en: z.string().optional().nullable(),
        title_ar: z.string().optional().nullable(),
        description_ar: z.string().optional().nullable(),
        buttonContent: z.string().optional().nullable(),
        link: z.string().optional().nullable(),
        image: z.number().min(1, {
          message: dictionary.forms.image + " " + dictionary.errors.required,
        }),
        priority: z.number(),
      })
    ),
  });
};

export type SliderFormData = z.infer<ReturnType<typeof getSliderFormSchema>>;
