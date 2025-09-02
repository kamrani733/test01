"use client";

import type React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/core/hooks/use-dictionary";
import {
  getUserFormSchema,
  UpdateUserFormData,
  type UserFormData,
} from "@/core/schemas/userSchema";
import { DatePicker } from "../input/DatePicker";
import { SearchableCombobox } from "@/components/ui/SearchableCombobox";
import { Heading } from "@/components/ui/Heading";
import TextInput from "@/components/account/input/TextInput";
import SelectField from "../input/SelectField";
import FileUploadInput from "../input/FileUploadInput";
import { useRouter } from "next/navigation";
import ContainerView from "../ContainerView";
import { Loader2 } from "lucide-react";
import PasswordInput from "../input/PasswordInput";
import { ImageTs } from "@/core/types/imageTs";
import FormSection from "../FormSection";
import { getOptions } from "@/constants/options";
import { createUser, updateUser } from "@/core/lib/api/account/users";
import { useCreateUpdateMutation } from "@/core/hooks/common/useCreateUpdateMutation";
import TextareaInput from "../input/TextareaInput";

interface List {
  value: number;
  label: string;
}

interface CreateEditUserFormProps {
  rolesList: List[];
  cities: List[];
  defaultValue?: Partial<UserFormData> & { avatar?: ImageTs };
}

export default function CreateEditUserForm({
  rolesList,
  cities,
  defaultValue,
}: CreateEditUserFormProps) {
  const isEditSession = Boolean(defaultValue);
  const router = useRouter();
  const { dictionary } = useDictionary();
  const { STATUS_OPTIONS_USER, GENDER_OPTIONS, LEVEL_OPTIONS } =
    getOptions(dictionary);
  const userFormSchema = getUserFormSchema(dictionary, isEditSession);
  const [avatarId, setAvatarId] = useState<number | null>(null);

  const filterDefaultValueWithoutNull = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, value]) => value !== null)
  );
  const { id } = filterDefaultValueWithoutNull;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<UserFormData>({
    defaultValues: {
      status: "active",
      ...filterDefaultValueWithoutNull,
    },
    resolver: zodResolver(userFormSchema),
  });

  const createMutation = useCreateUpdateMutation<UserFormData>({
    mutationFn: (data) => {
      const payload = { ...data };
      if (avatarId) payload.avatar_id = avatarId;
      return createUser(payload);
    },
    queryKey: ["users"],
    operation: "create",
    setError,
    onSuccess: () => {
      router.push("/admin/users");
    },
  });

  const updateMutation = useCreateUpdateMutation<UserFormData & { id: number }>(
    {
      mutationFn: (data) => {
        const payload = { ...data, id: id as number };
        if (avatarId) payload.avatar_id = avatarId;
        return updateUser(payload as UpdateUserFormData, id as number);
      },
      queryKey: ["users"],
      operation: "update",
      setError,
      onSuccess: () => {
        router.push("/admin/users");
      },
    }
  );

  const onSubmit = (data: UserFormData) => {
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
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Heading level={3}>
          {isEditSession
            ? dictionary.common.edit + " " + dictionary.forms.user
            : dictionary.common.add + " " + dictionary.forms.user}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>
      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Personal Information */}
          <FormSection title={dictionary.ui.form.personalInfo}>
            <TextInput
              label={`${dictionary.forms.firstname} `}
              name="first_name"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.firstname}
              disabled={isSubmitting}
            />
            <TextInput
              label={`${dictionary.forms.lastname} `}
              name="last_name"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.lastname}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.nickname + dictionary.common.optional}
              name="nickname"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.nickname}
              disabled={isSubmitting}
            />
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <SelectField
                  label={dictionary.forms.gender + dictionary.common.optional}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  options={GENDER_OPTIONS}
                  placeholder={dictionary.forms.gender}
                  disabled={isSubmitting}
                  error={errors.gender?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="birthdate_jalali"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  errors={errors}
                  placeholder={dictionary.forms.birthdate}
                  label={
                    dictionary.forms.birthdate + dictionary.common.optional
                  }
                  name="birthdate_jalali"
                />
              )}
            />
            <Controller
              control={control}
              name="date_marriage"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  errors={errors}
                  placeholder={dictionary.forms.dateMarriage}
                  label={
                    dictionary.forms.dateMarriage + dictionary.common.optional
                  }
                  name="date_marriage"
                />
              )}
            />
            <TextInput
              label={dictionary.forms.nationalCode + dictionary.common.optional}
              name="national_code"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.nationalCode}
              disabled={isSubmitting}
            />
          </FormSection>

          {/* Contact Information */}
          <FormSection title={dictionary.ui.form.contactInfo}>
            <TextInput
              label={`${dictionary.forms.mobile} `}
              name="mobile"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.mobile}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.email + dictionary.common.optional}
              name="email"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.email}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.phoneCode + dictionary.common.optional}
              name="phone_code"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.phoneCode}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.phone + dictionary.common.optional}
              name="phone"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.phone}
              disabled={isSubmitting}
            />
          </FormSection>

          {/* Address Information */}
          <FormSection title={dictionary.ui.form.addressInfo}>
            <Controller
              control={control}
              name="city_id"
              render={({ field }) => (
                <SearchableCombobox
                  options={cities}
                  value={field.value}
                  onValueChange={field.onChange}
                  label={dictionary.forms.city}
                  placeholder={dictionary.forms.selectCity}
                  disabled={isSubmitting}
                  error={errors.city_id?.message}
                />
              )}
            />
            <TextareaInput
              label={dictionary.forms.address + dictionary.common.optional}
              name="address"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.address}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.postalCode + dictionary.common.optional}
              name="postal_code"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.postalCode}
              disabled={isSubmitting}
            />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput
                label={dictionary.forms.plaque + dictionary.common.optional}
                name="address_plaque"
                register={register}
                errors={errors}
                placeholder={dictionary.forms.plaque}
                disabled={isSubmitting}
              />
              <TextInput
                label={dictionary.forms.floor + dictionary.common.optional}
                name="address_floor"
                register={register}
                errors={errors}
                placeholder={dictionary.forms.floor}
                disabled={isSubmitting}
              />
              <TextInput
                label={dictionary.forms.unit + dictionary.common.optional}
                name="address_unit"
                register={register}
                errors={errors}
                placeholder={dictionary.forms.unit}
                disabled={isSubmitting}
              />
            </div>
          </FormSection>

          {/* Additional Information */}
          <FormSection title={dictionary.ui.form.aditionalInfo}>
            {!isEditSession && (
              <PasswordInput
                label={dictionary.forms.password}
                name="password"
                register={register}
                errors={errors}
                placeholder={dictionary.forms.password}
                disabled={isSubmitting}
              />
            )}
            <Controller
              control={control}
              name="role_id"
              render={({ field }) => (
                <SearchableCombobox
                  options={rolesList}
                  value={field.value}
                  onValueChange={field.onChange}
                  label={dictionary.forms.role}
                  placeholder={dictionary.forms.selectRole}
                  disabled={isSubmitting}
                  error={errors.role_id?.message}
                />
              )}
            />
            <TextInput
              label={dictionary.forms.job + dictionary.common.optional}
              name="job"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.job}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.education + dictionary.common.optional}
              name="education"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.education}
              disabled={isSubmitting}
            />
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SelectField
                  label={dictionary.forms.status}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  options={STATUS_OPTIONS_USER}
                  placeholder={dictionary.forms.status}
                  disabled={isSubmitting}
                  error={errors.status?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="level"
              render={({ field }) => (
                <SelectField
                  label={dictionary.forms.level + dictionary.common.optional}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  options={LEVEL_OPTIONS}
                  placeholder={dictionary.forms.level}
                  disabled={isSubmitting}
                  error={errors.level?.message}
                />
              )}
            />
          </FormSection>

          {/* Avatar Upload */}
          <FormSection
            title={dictionary.forms.avatar + dictionary.common.optional}
          >
            <FileUploadInput
              accept="image/*"
              disabled={isSubmitting}
              onUploadSuccess={(image) => {
                const imageId = image?.id ? Number(image.id) : null;
                setAvatarId(imageId);
                setValue("avatar_id", imageId || undefined);
              }}
              error={errors.avatar_id?.message}
              defaultImageUrl={defaultValue?.avatar?.url}
              defaultImageName={defaultValue?.avatar?.name}
            />
          </FormSection>

          {/* Submit Button */}
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
      </ContainerView>
    </div>
  );
}
