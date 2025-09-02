// types/globalSettings.ts
export interface Settings {
  // SEO
  meta_title: string;
  meta_description: string;
  meta_description_en: string;
  meta_description_ar: string;
  meta_keywords: string;
  meta_keywords_en: string;
  meta_keywords_ar: string;
  keyword_en: string;
  keyword_ar: string;

  // Site
  site_title: string;
  site_title_en: string;
  site_title_ar: string;
  site_description: string;
  site_description_en: string;
  site_description_ar: string;

  logo_desktop: string;
  logo_mobile: string;
  fav_icon: string;

  // Contact
  company_phone: string;
  company_mobile: string;
  admin_email: string;
  company_address: string;
  company_address_en: string;
  company_address_ar: string;

  logo_desktop_info?: {
    url: string;
    name: string;
  };
  logo_mobile_info?: {
    url: string;
    name: string;
  };
  fav_icon_info?: {
    url: string;
    name: string;
  };
}

export interface ImageFile {
  id: number;
  url: string;
  name: string;
}
