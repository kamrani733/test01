import { Dictionary } from "@/core/lib/dict";
import { z } from "zod";

export const getRoleFormSchema = (dictionary: Dictionary, isEdit: boolean = false) => {
  return z.object({
    name: z
      .string()
      .min(1, {
        message: dictionary.forms.name + " " + dictionary.errors.required,
      })
      .min(2, {
        message: dictionary.forms.name + " باید حداقل 2 کاراکتر باشد",
      })
      .max(50, {
        message: dictionary.forms.name + " نمی‌تواند بیش از 50 کاراکتر باشد",
      })
      .regex(/^[A-Za-z0-9_-]+$/, {
        message: dictionary.forms.name + " فقط می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد",
      })
      .refine(async (name) => {
        if (isEdit) return true; // Skip validation for edit mode initially
        const { checkRoleNameExists } = await import("@/core/lib/api/account/roles");
        const result = await checkRoleNameExists(name);
        return !result.exists;
      }, {
        message: "نقش با این نام قبلاً وجود دارد",
      }),
    title: z
      .string()
      .min(1, {
        message: dictionary.forms.title + " " + dictionary.errors.required,
      })
      .min(2, {
        message: dictionary.forms.title + " باید حداقل 2 کاراکتر باشد",
      })
      .max(100, {
        message: dictionary.forms.title + " نمی‌تواند بیش از 100 کاراکتر باشد",
      }),
    level: z.coerce
      .number()
      .min(0, dictionary.forms.level + " " + dictionary.errors.required)
      .max(999, "سطح نقش نمی‌تواند بیش از 999 باشد"),
    systemic: z.enum(["yes", "no"], {
      message: dictionary.forms.systemic + " " + dictionary.errors.required,
    }),
    description: z
      .string()
      .max(500, "توضیحات نمی‌تواند بیش از 500 کاراکتر باشد")
      .optional(),
  });
};

export type RoleFormData = z.infer<ReturnType<typeof getRoleFormSchema>>;
