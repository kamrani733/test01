"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useDictionary } from "@/core/hooks/use-dictionary";
import { Heading } from "@/components/ui/Heading";
import TextInput from "../input/TextInput";
import { Loader2 } from "lucide-react";
import ContainerView from "../ContainerView";
import {
  getShopInventoryFormSchema,
  ShopInventoryFormData,
} from "@/core/schemas/shopInventorySchema";
import { useRouter } from "next/navigation";

import { ShopInventory } from "@/core/models/shop-inventory-model";
import { List, SearchableCombobox } from "@/components/ui/SearchableCombobox";
import {
  createShopInventory,
  updateShopInventory,
} from "@/core/lib/api/account/shop-inventories";

interface CreateEditShopInventoryProps {
  defaultValue?: Partial<ShopInventory>;
  shopStoresList: List<number>[];
  shopProductsList: List<number>[];
}

export default function CreateEditShopInventoryForm({
  defaultValue,
  shopStoresList,
  shopProductsList,
}: CreateEditShopInventoryProps) {
  console.log(defaultValue);

  const router = useRouter();
  const isEditSession = Boolean(defaultValue);
  const { dictionary } = useDictionary();
  console.log(shopProductsList);

  const shopInventoryFormSchema = getShopInventoryFormSchema(dictionary);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
  } = useForm<ShopInventoryFormData>({
    resolver: zodResolver(shopInventoryFormSchema),
    defaultValues: {
      ...defaultValue,
      store_id: defaultValue?.store_id?.value,
      product_id: defaultValue?.product_id?.value,
    },
  });

  const onSubmit = async (data: ShopInventoryFormData) => {
    try {
      const finalData = {
        store_id: data.store_id,
        product_id: data.product_id,
        inventory: data.inventory,
      };
      const result = isEditSession
        ? await updateShopInventory(finalData, defaultValue?.id as number)
        : await createShopInventory(finalData);

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/shop/inventories");
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as keyof ShopInventoryFormData, {
              type: "server",
              message: messages.join("، "),
            });
          }
        });
        toast.error(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : dictionary.common.error
      );
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Heading level={3}>
          {isEditSession
            ? `${dictionary.common.edit} ${dictionary.nav.inventory}`
            : `${dictionary.common.add} ${dictionary.nav.inventory}`}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>

      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <Controller
            control={control}
            name="store_id"
            render={({ field }) => (
              <SearchableCombobox
                label={dictionary.nav.store}
                value={field.value}
                onValueChange={field.onChange}
                options={shopStoresList}
                placeholder={dictionary.nav.store}
                disabled={isSubmitting}
                error={errors.store_id?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="product_id"
            render={({ field }) => (
              <SearchableCombobox
                label={dictionary.nav.product}
                value={field.value}
                onValueChange={field.onChange}
                options={shopProductsList}
                placeholder={dictionary.nav.product}
                disabled={isSubmitting}
                error={errors.product_id?.message}
              />
            )}
          />
          <TextInput
            label={dictionary.nav.inventory}
            name="inventory"
            type="number"
            placeholder={dictionary.nav.inventory}
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-base"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              dictionary.common.submit
            )}
          </Button>
        </form>
      </ContainerView>
    </div>
  );
}
