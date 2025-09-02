export interface Settings {
  site_title: string;
  site_description: string;
  meta_title: string;
  meta_description: string;
  mete_keywords: string | null;
  keyword: string | null;
  logo_desktop: string;
  logo_mobile: string;
  fav_icon: string;
  company_phone: string;
  company_mobile: string;
  admin_email: string;
  company_address: string;
  company_lat: string;
  company_lon: string;
}

export interface SocialItem {
  id: number;
  type: string;
  title: string;
  link: string;
  status?: string;
}

export interface Slide {
  title: string;
  coding: string;
  image: number;
  priority: number;
  image_info: {
    id: number;
    url: string;
    description: string;
  };
}
