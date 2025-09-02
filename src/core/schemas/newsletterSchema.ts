import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
});

export type EmailSchemaData = z.infer<typeof emailSchema>;
