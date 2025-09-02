import { RowData } from "./row-data";

export interface Party extends RowData {
  id: number;
  entity: "company" | "person";
  type: string[];
  code?: string;
  email?: string;
  mobile: string;
  status: "active" | "deactive";
  city_id: number;
  address?: string;
  address_plaque?: string;
  address_floor?: string;
  address_unit?: string;
  postal_code?: string;
  mobile2?: string;
  pre_phone?: string;
  phone?: string;
  pre_phone2?: string;
  phone2?: string;
  website?: string;
  description?: string;
  logo_avatar_id?: number;
  location_lat?: number;
  location_lon?: number;
  created_at: string;
  updated_at: string;
}

export interface Company extends Party {
  entity: "company";
  legal_name?: string;
  trade_name: string;
  national_id?: string;
  registration_code?: string;
  economic_issue?: string;
  established_date?: string;
  employee_num?: string;
}

export interface Person extends Party {
  entity: "person";
  first_name: string;
  last_name: string;
  national_code?: string;
  gender?: "male" | "female";
  birthdate?: string;
  date_marriage?: string;
  job?: string;
  fax?: string;
  bank_name?: string;
  card_number?: string;
  account_number?: string;
  iban?: string;
  referrer_name?: string;
  referrer_job?: string;
  referrer_phone?: string;
  driving_license_number?: string;
  driving_license_type?: string;
}

export type PartyType = Company | Person;

export interface PartyTypeOption {
  key: string;
  label: string;
}

export const PARTY_TYPE_OPTIONS: PartyTypeOption[] = [
  { key: "marketer", label: "بازاریاب" },
  { key: "users", label: "کاربران" },
  { key: "contractor", label: "پیمانکار" },
  { key: "customer", label: "مشتری" },
  { key: "personnel", label: "پرسنل" },
  { key: "supplier", label: "تأمین‌کننده" },
  { key: "colleague", label: "همکار" },
];

export const STATUS_OPTIONS = [
  { key: "active", label: "فعال" },
  { key: "deactive", label: "غیرفعال" },
];

export const GENDER_OPTIONS = [
  { key: "male", label: "مرد" },
  { key: "female", label: "زن" },
];

export const EMPLOYEE_NUM_OPTIONS = [
  { key: "1-10", label: "1-10" },
  { key: "10-25", label: "10-25" },
  { key: "25-50", label: "25-50" },
  { key: "50-100", label: "50-100" },
  { key: "100-250", label: "100-250" },
  { key: "250-500", label: "250-500" },
  { key: "500+", label: "500+" },
];
