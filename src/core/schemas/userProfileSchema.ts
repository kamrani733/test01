import { z } from "zod";

export const userProfileSchema = z.object({
  first_name: z.string().min(1, "نام الزامی است").max(255),
  last_name: z.string().min(1, "نام خانوادگی الزامی است").max(255),
  location_lat: z.string().optional().nullable(),
  location_lon: z.string().optional().nullable(),
  nickname: z.string().max(255).optional().nullable(),
  email: z.string().email("ایمیل معتبر نیست").max(255).optional().nullable(),
  avatar_id: z.number().optional().nullable(),
  avatar: z
    .union([
      z.instanceof(File),
      z.number(),
      z.object({
        id: z.number(),
        name: z.string(),
        url: z.string().url(),
        description: z.string().optional().nullable(),
      }),
    ])
    .optional()
    .nullable()
    .refine(
      (file) => !(file instanceof File) || file.size <= 2 * 1024 * 1024,
      "حداکثر حجم فایل ۲ مگابایت است"
    )
    .refine(
      (file) =>
        !(file instanceof File) ||
        ["image/jpeg", "image/png"].includes(file.type),
      "فرمت مجاز: JPG یا PNG"
    ),

  phone: z.string().max(255).optional().nullable(),
  phone_code: z.string().max(5).optional().nullable(),
  gender: z.enum(["male", "female"]).optional().nullable(),
  city_id: z.number().optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  address_plaque: z.string().max(45).optional().nullable(),
  address_floor: z.string().max(45).optional().nullable(),
  address_unit: z.string().max(45).optional().nullable(),
  postal_code: z.string().max(45).optional().nullable(),
  education: z.string().max(255).optional().nullable(),
  job: z.string().max(255).optional().nullable(),
  national_code: z.string().max(255).optional().nullable(),
  date_marriage: z.string().optional().nullable(), // validation disabled as backend says inactive
  birthdate_jalali: z.string().optional().nullable(),
});

export type UserProfileData = z.infer<typeof userProfileSchema>;
