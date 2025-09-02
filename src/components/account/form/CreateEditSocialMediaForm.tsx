"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import TextInput from "@/components/account/input/TextInput";
import SelectField from "@/components/account/input/SelectField";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useDictionary } from "@/core/hooks/use-dictionary";
import { Social, SOCIAL_TYPES } from "@/core/models/social-model";
import {
  getSocialFormSchema,
  SocialFormData,
} from "@/core/schemas/socialSchema";
import {
  createSocailMedia,
  updateSocailMedia,
} from "@/core/lib/api/account/socialmedia";
import { useCreateUpdateMutation } from "@/core/hooks/common/useCreateUpdateMutation";

interface CreateEditSocialFormProps {
  onSuccess: () => void;
  socialToEdit?: Partial<Social>;
}

export default function CreateEditSocialForm({
  onSuccess,
  socialToEdit = {},
}: CreateEditSocialFormProps) {
  const { id } = socialToEdit;
  const { dictionary } = useDictionary();
  const isEditSession = Boolean(socialToEdit?.id);
  const socialFormSchema = getSocialFormSchema(dictionary);

  const STATUS_OPTIONS = [
    { value: "active", label: dictionary.ui.status.active },
    { value: "deactive", label: dictionary.ui.status.deactive },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<SocialFormData>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      type: socialToEdit.type,
      link: socialToEdit.link ?? "",
      status: socialToEdit.status ?? "active",
      title: socialToEdit.title ?? "",
      title_en: socialToEdit.title_en ?? "",
      title_ar: socialToEdit.title_ar ?? "",
    },
  });

  const createMutation = useCreateUpdateMutation<SocialFormData>({
    mutationFn: createSocailMedia,
    queryKey: ["social-media"],
    operation: "create",
    setError,
    onSuccess,
  });

  const updateMutation = useCreateUpdateMutation<
    SocialFormData & { id: number }
  >({
    mutationFn: (data) => updateSocailMedia(data, data.id),
    queryKey: ["social-media"],
    operation: "update",
    setError,
    onSuccess,
  });

  const onSubmit = (data: SocialFormData) => {
    if (isEditSession) {
      updateMutation.mutate({ ...data, id: id! });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = isEditSession
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-full"
    >
      <Tabs defaultValue="fa" className="w-full">
        <TabsList className="border border-muted">
          <TabsTrigger value="fa">{dictionary.ui.language.fa}</TabsTrigger>
          <TabsTrigger value="en">{dictionary.ui.language.en}</TabsTrigger>
          <TabsTrigger value="ar">{dictionary.ui.language.ar}</TabsTrigger>
        </TabsList>
        <TabsContent value="fa">
          <TextInput
            label={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
            name="title"
            placeholder={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
            register={register}
            errors={errors}
            disabled={isPending}
          />
        </TabsContent>
        <TabsContent value="en">
          <TextInput
            label={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
            name="title_en"
            placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
            register={register}
            errors={errors}
            disabled={isPending}
          />
        </TabsContent>
        <TabsContent value="ar">
          <TextInput
            label={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
            name="title_ar"
            placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
            register={register}
            errors={errors}
            disabled={isPending}
          />
        </TabsContent>
      </Tabs>
      <TextInput
        label={dictionary.forms.link}
        name="link"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.link}
        disabled={isPending}
      />
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <SelectField
            label={dictionary.forms.type}
            value={field.value || ""}
            onValueChange={field.onChange}
            options={SOCIAL_TYPES.map((key) => ({
              value: key,
              label: dictionary.ui.socialMedia[key],
            }))}
            error={errors.type?.message}
            disabled={isPending}
            placeholder={dictionary.forms.type}
          />
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <SelectField
            label={dictionary.forms.status}
            defaultValue="active"
            value={field.value || ""}
            onValueChange={field.onChange}
            options={STATUS_OPTIONS}
            placeholder={dictionary.forms.status}
            disabled={isPending}
            error={errors.status?.message}
          />
        )}
      />
      <Button
        type="submit"
        disabled={isPending}
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
