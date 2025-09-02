import { Dictionary } from "@/core/lib/dict";
import { z } from "zod";

// Common party fields schema
const partyFieldsSchema = z.object({
  entity: z.enum(["company", "person"], {
    message: "نوع موجودیت باید company یا person باشد",
  }),
  type: z.array(z.string()).optional(),
  code: z
    .string()
    .regex(/^[A-Za-z0-9_-]*$/, {
      message: "کد طرف فقط می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد",
    })
    .max(190, "کد طرف نمی‌تواند بیش از 190 کاراکتر باشد")
    .optional(),
  email: z
    .string()
    .email("فرمت ایمیل صحیح نیست")
    .max(190, "ایمیل نمی‌تواند بیش از 190 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  mobile: z
    .string()
    .min(11, "شماره موبایل باید 11 رقم باشد")
    .max(11, "شماره موبایل باید 11 رقم باشد")
    .regex(/^09\d{9}$/, "فرمت شماره موبایل صحیح نیست"),
  status: z.enum(["active", "deactive"], {
    message: "وضعیت باید active یا deactive باشد",
  }),
  city_id: z.coerce.number().min(1, "شهر الزامی است"),
  address: z.string().max(500, "آدرس نمی‌تواند بیش از 500 کاراکتر باشد").optional(),
  address_plaque: z.string().max(45, "پلاک نمی‌تواند بیش از 45 کاراکتر باشد").optional(),
  address_floor: z.string().max(45, "طبقه نمی‌تواند بیش از 45 کاراکتر باشد").optional(),
  address_unit: z.string().max(45, "واحد نمی‌تواند بیش از 45 کاراکتر باشد").optional(),
  postal_code: z.string().max(20, "کد پستی نمی‌تواند بیش از 20 کاراکتر باشد").optional(),
  mobile2: z
    .string()
    .regex(/^09\d{9}$/, "فرمت شماره موبایل دوم صحیح نیست")
    .max(11, "شماره موبایل دوم باید 11 رقم باشد")
    .optional()
    .or(z.literal("")),
  pre_phone: z.string().max(5, "پیش‌شماره نمی‌تواند بیش از 5 کاراکتر باشد").optional(),
  phone: z.string().max(10, "تلفن نمی‌تواند بیش از 10 کاراکتر باشد").optional(),
  pre_phone2: z.string().max(5, "پیش‌شماره دوم نمی‌تواند بیش از 5 کاراکتر باشد").optional(),
  phone2: z.string().max(32, "تلفن دوم نمی‌تواند بیش از 32 کاراکتر باشد").optional(),
  website: z
    .string()
    .url("فرمت وب‌سایت صحیح نیست")
    .max(255, "وب‌سایت نمی‌تواند بیش از 255 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  description: z.string().max(500, "توضیحات نمی‌تواند بیش از 500 کاراکتر باشد").optional(),
  logo_avatar_id: z.coerce.number().optional(),
  location_lat: z
    .coerce
    .number()
    .min(-90, "عرض جغرافیایی باید بین -90 تا 90 باشد")
    .max(90, "عرض جغرافیایی باید بین -90 تا 90 باشد")
    .optional(),
  location_lon: z
    .coerce
    .number()
    .min(-180, "طول جغرافیایی باید بین -180 تا 180 باشد")
    .max(180, "طول جغرافیایی باید بین -180 تا 180 باشد")
    .optional(),
});

// Company specific fields schema
const companyFieldsSchema = z.object({
  legal_name: z.string().max(255, "نام حقوقی نمی‌تواند بیش از 255 کاراکتر باشد").optional(),
  trade_name: z.string().min(1, "نام تجاری الزامی است").max(255, "نام تجاری نمی‌تواند بیش از 255 کاراکتر باشد"),
  national_id: z
    .string()
    .regex(/^\d+$/, "شناسه ملی باید فقط شامل اعداد باشد")
    .max(20, "شناسه ملی نمی‌تواند بیش از 20 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  registration_code: z
    .string()
    .max(100, "کد ثبت نمی‌تواند بیش از 100 کاراکتر باشد")
    .optional(),
  economic_issue: z
    .string()
    .regex(/^\d+$/, "کد اقتصادی باید فقط شامل اعداد باشد")
    .max(100, "کد اقتصادی نمی‌تواند بیش از 100 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  established_date: z
    .string()
    .regex(/^\d{4}\/\d{1,2}\/\d{1,2}$/, "فرمت تاریخ باید Y/m/d شمسی باشد")
    .optional(),
  employee_num: z.string().max(100, "تعداد کارکنان نمی‌تواند بیش از 100 کاراکتر باشد").optional(),
});

// Person specific fields schema
const personFieldsSchema = z.object({
  first_name: z.string().min(1, "نام الزامی است").max(100, "نام نمی‌تواند بیش از 100 کاراکتر باشد"),
  last_name: z.string().min(1, "نام خانوادگی الزامی است").max(100, "نام خانوادگی نمی‌تواند بیش از 100 کاراکتر باشد"),
  national_code: z
    .string()
    .regex(/^\d{10}$/, "کد ملی باید 10 رقم باشد")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["male", "female"]).optional(),
  birthdate: z
    .string()
    .regex(/^\d{4}\/\d{1,2}\/\d{1,2}$/, "فرمت تاریخ باید Y/m/d شمسی باشد")
    .optional(),
  date_marriage: z
    .string()
    .regex(/^\d{4}\/\d{1,2}\/\d{1,2}$/, "فرمت تاریخ باید Y/m/d شمسی باشد")
    .optional(),
  job: z.string().max(255, "شغل نمی‌تواند بیش از 255 کاراکتر باشد").optional(),
  fax: z
    .string()
    .regex(/^[\d\-\+\(\)\s]+$/, "فرمت فکس صحیح نیست")
    .max(20, "فکس نمی‌تواند بیش از 20 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  bank_name: z.string().max(100, "نام بانک نمی‌تواند بیش از 100 کاراکتر باشد").optional(),
  card_number: z
    .string()
    .regex(/^[\d\-\s]+$/, "فرمت شماره کارت صحیح نیست")
    .min(16, "شماره کارت باید حداقل 16 رقم باشد")
    .max(20, "شماره کارت نمی‌تواند بیش از 20 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  account_number: z
    .string()
    .regex(/^[\d\-\s]+$/, "فرمت شماره حساب صحیح نیست")
    .max(30, "شماره حساب نمی‌تواند بیش از 30 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  iban: z
    .string()
    .regex(/^IR\d{22}$/, "فرمت شماره شبا صحیح نیست")
    .min(24, "شماره شبا باید 24 رقم باشد")
    .max(34, "شماره شبا نمی‌تواند بیش از 34 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  referrer_name: z.string().max(100, "نام معرف نمی‌تواند بیش از 100 کاراکتر باشد").optional(),
  referrer_job: z.string().max(100, "شغل معرف نمی‌تواند بیش از 100 کاراکتر باشد").optional(),
  referrer_phone: z
    .string()
    .regex(/^[\d\-\+\(\)\s]+$/, "فرمت تلفن معرف صحیح نیست")
    .max(15, "تلفن معرف نمی‌تواند بیش از 15 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  driving_license_number: z
    .string()
    .regex(/^[\dA-Za-z\-]+$/, "فرمت شماره گواهینامه صحیح نیست")
    .max(20, "شماره گواهینامه نمی‌تواند بیش از 20 کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  driving_license_type: z.string().max(255, "نوع گواهینامه نمی‌تواند بیش از 255 کاراکتر باشد").optional(),
});

// Combined schemas
export const getCompanyFormSchema = (dictionary: Dictionary) => {
  return partyFieldsSchema.merge(companyFieldsSchema).extend({
    entity: z.literal("company"),
  });
};

export const getPersonFormSchema = (dictionary: Dictionary) => {
  return partyFieldsSchema.merge(personFieldsSchema).extend({
    entity: z.literal("person"),
  });
};

export type CompanyFormData = z.infer<ReturnType<typeof getCompanyFormSchema>>;
export type PersonFormData = z.infer<ReturnType<typeof getPersonFormSchema>>;
export type PartyFormData = CompanyFormData | PersonFormData;
