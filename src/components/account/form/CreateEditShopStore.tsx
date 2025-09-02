"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TextInput from "@/components/account/input/TextInput";
import {
  getShopStoreFormSchema,
  ShopStoreFormData,
} from "@/core/schemas/shopStoreSchema";
import { ShopStore } from "@/core/models/shop-store-model";
import { useDictionary } from "@/core/hooks/use-dictionary";
import {
  createShopStore,
  updateShopStore,
} from "@/core/lib/api/account/shop-store";
import { useCreateUpdateMutation } from "@/core/hooks/common/useCreateUpdateMutation";

interface CreateEditShopStoreFormProps {
  onSuccess: () => void;
  shopStoreToEdit?: Partial<ShopStore>;
}

export default function CreateEditShopStoreForm({
  onSuccess,
  shopStoreToEdit = {},
}: CreateEditShopStoreFormProps) {
  const { id } = shopStoreToEdit;
  const { dictionary } = useDictionary();
  const shopStoreFormSchema = getShopStoreFormSchema(dictionary);
  const isEditSession = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ShopStoreFormData>({
    defaultValues: {
      title: shopStoreToEdit.title || "",
      code: shopStoreToEdit.code || "",
    },
    resolver: zodResolver(shopStoreFormSchema),
  });

  const createMutation = useCreateUpdateMutation<ShopStoreFormData>({
    mutationFn: createShopStore,
    queryKey: ["shop-stores"],
    operation: "create",
    setError,
    onSuccess,
  });

  const updateMutation = useCreateUpdateMutation<ShopStoreFormData & { id: number }>({
    mutationFn: (data) => updateShopStore(data, data.id),
    queryKey: ["shop-stores"],
    operation: "update",
    setError,
    onSuccess,
  });

  const onSubmit = (data: ShopStoreFormData) => {
    if (isEditSession) {
      updateMutation.mutate({ ...data, id: id as number });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = isEditSession
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    <form
      className="flex w-full min-w-10 flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        label={dictionary.forms.title}
        name="title"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.title}
        disabled={isPending}
      />
      <TextInput
        label={dictionary.forms.code}
        name="code"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.code}
        disabled={isPending}
      />
      <Button
        disabled={isPending}
        type="submit"
        className="w-full h-11 text-base"
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          dictionary.common.submit
        )}
      </Button>
    </form>
  );
}
