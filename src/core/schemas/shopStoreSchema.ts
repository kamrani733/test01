import { z } from "zod";
import { Dictionary } from "@/core/lib/dict";

export const getShopStoreFormSchema = (dictionary: Dictionary) => {
  return z.object({
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    code: z.string().min(1, {
      message: dictionary.forms.code + " " + dictionary.errors.required,
    }),
  });
};

export type ShopStoreFormData = z.infer<
  ReturnType<typeof getShopStoreFormSchema>
>;
