"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { Heading } from "@/components/ui/Heading";
import TextInput from "../input/TextInput";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContainerView from "../ContainerView";
import FormSection from "../FormSection";
import {
  getShopTagFormSchema,
  ShopTagFormData,
} from "@/core/schemas/shopTagSchema";
import { useRouter } from "next/navigation";
import { ShopTag } from "@/core/models/shop-tag-model";
import { createShopTag, updateShopTag } from "@/core/lib/api/account/shop-tags";
import { useCreateUpdateMutation } from "@/core/hooks/common/useCreateUpdateMutation";

interface CreateEditShopTagFormProps {
  defaultValue?: Partial<ShopTag>;
}

export default function CreateEditShopTagForm({
  defaultValue,
}: CreateEditShopTagFormProps) {
  const router = useRouter();
  const isEditSession = Boolean(defaultValue);
  const { dictionary } = useDictionary();

  const shopTagFormSchema = getShopTagFormSchema(dictionary);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ShopTagFormData>({
    defaultValues: {
      title: defaultValue?.title || "",
      description: defaultValue?.description || "",
      meta_title: defaultValue?.meta_title || "",
      meta_description: defaultValue?.meta_description || "",
      meta_keywords: defaultValue?.meta_keywords || "",
      meta_link_canonical: defaultValue?.meta_link_canonical || "",
      title_en: defaultValue?.title_en || "",
      title_ar: defaultValue?.title_ar || "",
      description_en: defaultValue?.description_en || "",
      description_ar: defaultValue?.description_ar || "",
    },
    resolver: zodResolver(shopTagFormSchema),
  });

  const multilingualFields = ["title", "description"];
  const nonMultilingualFields = [
    "meta_title",
    "meta_description",
    "meta_keywords",
    "meta_link_canonical",
  ];
  
  const getLabelOrPlaceholder = (field: string, lang: string): string => {
    const baseField = field.replace(/_en|_ar/, "");

    const baseLabel =
      dictionary.forms[baseField as keyof typeof dictionary.forms] ?? baseField;
    const langLabel =
      dictionary.ui.language[lang as keyof typeof dictionary.ui.language] ??
      lang;

    return `${baseLabel} ${langLabel}`;
  };

  const createMutation = useCreateUpdateMutation<ShopTagFormData>({
    mutationFn: createShopTag,
    queryKey: ["shop-tags"],
    operation: "create",
    setError,
    onSuccess: () => router.push("/admin/shop/tags"),
  });

  const updateMutation = useCreateUpdateMutation<ShopTagFormData & { id: number }>({
    mutationFn: (data) => updateShopTag(data, data.id),
    queryKey: ["shop-tags"],
    operation: "update",
    setError,
    onSuccess: () => router.push("/admin/shop/tags"),
  });

  const onSubmit = (data: ShopTagFormData) => {
    if (isEditSession) {
      updateMutation.mutate({ ...data, id: defaultValue?.id as number });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = isEditSession
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Heading level={3}>
          {isEditSession
            ? `${dictionary.common.edit} ${dictionary.nav.tags}`
            : `${dictionary.common.add} ${dictionary.nav.tags}`}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>

      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormSection title={dictionary.ui.form.tagInfo}>
            {multilingualFields.map((baseField) => (
              <Tabs defaultValue="fa" className="w-full" key={baseField}>
                <TabsList className="border border-muted bg-primary-0">
                  <TabsTrigger
                    value="fa"
                    className="data-[state=active]:bg-muted"
                  >
                    {dictionary.ui.language.fa}
                  </TabsTrigger>
                  <TabsTrigger
                    value="en"
                    className="data-[state=active]:bg-muted"
                  >
                    {dictionary.ui.language.en}
                  </TabsTrigger>
                  <TabsTrigger
                    value="ar"
                    className="data-[state=active]:bg-muted"
                  >
                    {dictionary.ui.language.ar}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="fa">
                  <TextInput
                    label={getLabelOrPlaceholder(baseField, "fa")}
                    name={baseField}
                    placeholder={getLabelOrPlaceholder(baseField, "fa")}
                    register={register}
                    errors={errors}
                    disabled={isPending}
                  />
                </TabsContent>

                <TabsContent value="en">
                  <TextInput
                    label={getLabelOrPlaceholder(`${baseField}_en`, "en")}
                    name={`${baseField}_en`}
                    placeholder={getLabelOrPlaceholder(`${baseField}_en`, "en")}
                    register={register}
                    errors={errors}
                    disabled={isPending}
                  />
                </TabsContent>

                <TabsContent value="ar">
                  <TextInput
                    label={getLabelOrPlaceholder(`${baseField}_ar`, "ar")}
                    name={`${baseField}_ar`}
                    placeholder={getLabelOrPlaceholder(`${baseField}_ar`, "ar")}
                    register={register}
                    errors={errors}
                    disabled={isPending}
                  />
                </TabsContent>
              </Tabs>
            ))}
          </FormSection>
          <FormSection title={dictionary.ui.form.metaInfo}>
            {nonMultilingualFields.map((field) => {
              const rawLabel =
                dictionary.forms[field as keyof typeof dictionary.forms] ||
                field;
              const label = typeof rawLabel === "string" ? rawLabel : field;
              return (
                <TextInput
                  key={field}
                  label={label}
                  name={field}
                  register={register}
                  errors={errors}
                  placeholder={label}
                  disabled={isPending}
                />
              );
            })}
          </FormSection>

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
      </ContainerView>
    </div>
  );
}
