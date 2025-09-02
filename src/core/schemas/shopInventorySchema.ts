import { Dictionary } from "@/core/lib/dict";
import { z } from "zod";

export const getShopInventoryFormSchema = (dictionary: Dictionary) =>
  z.object({
    store_id: z.number({ message: dictionary.errors.required }),
    product_id: z.number({ message: dictionary.errors.required }),
    inventory: z.coerce.number().min(1, {
      message: dictionary.forms.name + " " + dictionary.errors.required,
    }),
  });

export type ShopInventoryFormData = z.infer<
  ReturnType<typeof getShopInventoryFormSchema>
>;
