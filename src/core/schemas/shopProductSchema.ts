import { z } from "zod";
import { Dictionary } from "@/core/lib/dict";

export const getShopProductFormSchema = (dictionary: Dictionary) =>
  z
    .object({
      title: z.string().min(1, {
        message: dictionary.forms.title + " " + dictionary.errors.required,
      }),
      title_en: z.string().optional().nullable(),
      title_ar: z.string().optional().nullable(),
      code: z.string(),
      status: z.enum(
        [
          "publish",
          "pending",
          "custom",
          "service",
          "project",
          "semiproduct",
          "cheklistitem",
          "analyze",
          "map",
          "fabric",
        ],
        {
          required_error: dictionary.errors.required,
        }
      ),
      excerpt: z.string().optional().nullable(),
      price: z.coerce.number().nullable().optional().nullable(),
      group_id: z.coerce.number(),
      fabric_area: z.coerce.number().nullable().optional().nullable(),
      fabric_basic_price: z.coerce.number().nullable().optional().nullable(),
      weight: z.coerce.number().nullable().optional().nullable(),
      description: z.string().optional().nullable(),
      description_en: z.string().optional().nullable(),
      description_ar: z.string().optional().nullable(),
      overalsize: z.string().optional().nullable(),
      content: z.string().optional().nullable(),
      alias: z.string().optional().nullable(),
      categories: z.array(z.object({ value: z.number(), label: z.string() })),
      related_products: z.array(
        z.object({ value: z.number(), label: z.string() })
      ),
      tags: z.array(
        z.object({
          value: z.number().or(z.string()),
          label: z.string(),
        })
      ),
      color_id: z.coerce.number(),
    })
    .catchall(z.any());

export type ShopProductFormData = z.infer<
  ReturnType<typeof getShopProductFormSchema>
>;

export type ShopProductPayload = Omit<
  ShopProductFormData,
  "categories" | "tags" | "related_products"
> & {
  categories: number[];
  tags: (string | number)[];
  related_products: number[];
  thumbnail?: number | null;
  images?: number[];
  color_id?: number | null;
};
