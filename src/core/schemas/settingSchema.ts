import { z } from "zod";

export const getSettingsSchema = () =>
  z.object({
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    meta_description_en: z.string().optional(),
    meta_description_ar: z.string().optional(),
    meta_keywords: z.string().optional(),
    meta_keywords_en: z.string().optional(),
    meta_keywords_ar: z.string().optional(),
    keyword_en: z.string().optional(),
    keyword_ar: z.string().optional(),
    site_title: z.string().optional(),
    site_title_en: z.string().optional(),
    site_title_ar: z.string().optional(),
    site_description: z.string().optional(),
    site_description_en: z.string().optional(),
    site_description_ar: z.string().optional(),
    logo_desktop: z.string().optional(),
    logo_mobile: z.string().optional(),
    fav_icon: z.string().optional(),
    company_phone: z.string().optional(),
    company_mobile: z.string().optional(),
    admin_email: z.string().optional(),
    company_address: z.string().optional(),
    company_address_en: z.string().optional(),
    company_address_ar: z.string().optional(),
    company_lat: z.string().optional(),
    company_lon: z.string().optional(),
  });

export type SettingsFormData = z.infer<ReturnType<typeof getSettingsSchema>>;
