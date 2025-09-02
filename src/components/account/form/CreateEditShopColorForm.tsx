"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/core/hooks/use-dictionary";
import TextInput from "../input/TextInput";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getShopColorSchema,
  ShopColorFormData,
} from "@/core/schemas/shopColorSchema";
import { ShopColor } from "@/core/models/shop-color-model";
import ColorInput from "../input/ColorInput";
import {
  createShopColor,
  updateShopColor,
} from "@/core/lib/api/account/shop-colors";
import { useCreateUpdateMutation } from "@/core/hooks/common/useCreateUpdateMutation";

interface CreateEditColorFormProps {
  colorToEdit?: Partial<ShopColor>;
  onSuccess?: () => void;
}

export default function CreateEditColorForm({
  colorToEdit,
  onSuccess,
}: CreateEditColorFormProps) {
  const isEditSession = Boolean(colorToEdit);
  const { dictionary } = useDictionary();

  const shopColorFormSchema = getShopColorSchema(dictionary);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ShopColorFormData>({
    defaultValues: {
      ...colorToEdit,
    },
    resolver: zodResolver(shopColorFormSchema),
  });

  const getLabelOrPlaceholder = (field: string, lang: string): string => {
    const baseField = field.replace(/_en|_ar/, "");
    const baseLabel =
      dictionary.forms[baseField as keyof typeof dictionary.forms] ?? baseField;
    const langLabel =
      dictionary.ui.language[lang as keyof typeof dictionary.ui.language] ??
      lang;
    return `${baseLabel} ${langLabel}`;
  };

  const createMutation = useCreateUpdateMutation<ShopColorFormData>({
    mutationFn: createShopColor,
    queryKey: ["shop-colors"],
    operation: "create",
    setError,
    onSuccess,
  });

  const updateMutation = useCreateUpdateMutation<ShopColorFormData & { id: number }>({
    mutationFn: (data) => updateShopColor(data, data.id),
    queryKey: ["shop-colors"],
    operation: "update",
    setError,
    onSuccess,
  });

  const onSubmit = (data: ShopColorFormData) => {
    if (isEditSession) {
      updateMutation.mutate({ ...data, id: colorToEdit?.id as number });
    } else {
      createMutation.mutate(data);
    }
  };
  console.log(errors);

  const isPending = isEditSession
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    // <div className="space-y-4 w-full">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <Tabs defaultValue="fa" className="w-full">
        <TabsList className="border border-muted">
          <TabsTrigger value="fa">{dictionary.ui.language.fa}</TabsTrigger>
          <TabsTrigger value="en">{dictionary.ui.language.en}</TabsTrigger>
          <TabsTrigger value="ar">{dictionary.ui.language.ar}</TabsTrigger>
        </TabsList>

        <TabsContent value="fa">
          <TextInput
            label={getLabelOrPlaceholder("title", "fa")}
            name="title"
            placeholder={getLabelOrPlaceholder("title", "fa")}
            register={register}
            errors={errors}
            disabled={isPending}
          />
        </TabsContent>

        <TabsContent value="en">
          <TextInput
            label={getLabelOrPlaceholder("title_en", "en")}
            name="title_en"
            placeholder={getLabelOrPlaceholder("title_en", "en")}
            register={register}
            errors={errors}
            disabled={isPending}
          />
        </TabsContent>

        <TabsContent value="ar">
          <TextInput
            label={getLabelOrPlaceholder("title_ar", "ar")}
            name="title_ar"
            placeholder={getLabelOrPlaceholder("title_ar", "ar")}
            register={register}
            errors={errors}
            disabled={isPending}
          />
        </TabsContent>
      </Tabs>
      <TextInput
        label={dictionary.forms.name}
        name="code"
        placeholder={dictionary.forms.name}
        register={register}
        errors={errors}
        disabled={isPending}
      />
      <TextInput
        label={dictionary.forms.code_hex}
        name="code_hex"
        placeholder={dictionary.forms.code_hex}
        register={register}
        errors={errors}
        disabled={isPending}
      />
      {/* <colorinput */}
      <ColorInput<ShopColorFormData>
        id="code_hex"
        label={dictionary.forms.code_hex}
        name="code_hex"
        register={register}
        errors={errors}
        defaultValue={colorToEdit?.code_hex || "#000000"}
        disabled={isPending}
      />
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-11 text-base"
      >
        {isPending ? (
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
        ) : (
          dictionary.common.submit
        )}
      </Button>
    </form>
    // </div>
  );
}
