"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import TextInput from "@/components/account/input/TextInput";
import TextareaInput from "@/components/account/input/TextareaInput";
import { getRoleFormSchema, RoleFormData } from "@/core/schemas/roleSchema";
import { Role } from "@/core/models/role-model";
import { useDictionary } from "@/core/hooks/use-dictionary";
import SelectField from "../input/SelectField";
import { createRole, updateRole, checkRoleNameExists } from "@/core/lib/api/account/roles";
import { useCreateUpdateMutation } from "@/core/hooks/common/useCreateUpdateMutation";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateEditRoleFormProps {
  onSuccess: () => void;
  roleToEdit?: Partial<Role>;
}

export default function CreateEditRoleForm({
  onSuccess,
  roleToEdit = {},
}: CreateEditRoleFormProps) {
  const { id } = roleToEdit;
  const { dictionary } = useDictionary();
  const isEditSession = Boolean(id);
  const [nameValidationError, setNameValidationError] = useState<string>("");
  const [isValidatingName, setIsValidatingName] = useState(false);

  const SYSTEMIC_OPTIONS = [
    { value: "yes", label: dictionary.common.yes },
    { value: "no", label: dictionary.common.no },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    watch,
    clearErrors,
  } = useForm<RoleFormData>({
    defaultValues: {
      title: roleToEdit.title || "",
      name: roleToEdit.name || "",
      level: roleToEdit.level || 1,
      systemic: roleToEdit.systemic || "no",
      description: roleToEdit.description || "",
    },
    resolver: zodResolver(getRoleFormSchema(dictionary, isEditSession)),
  });

  const watchedName = watch("name");

  // Validate role name uniqueness
  useEffect(() => {
    const validateName = async () => {
      if (!watchedName || watchedName.length < 2) {
        setNameValidationError("");
        return;
      }

      // Skip validation if it's the same as the original name in edit mode
      if (isEditSession && watchedName === roleToEdit.name) {
        setNameValidationError("");
        return;
      }

      setIsValidatingName(true);
      try {
        const result = await checkRoleNameExists(watchedName, isEditSession ? id : undefined);
        if (result.exists) {
          setNameValidationError("نقش با این نام قبلاً وجود دارد");
          setError("name", { message: "نقش با این نام قبلاً وجود دارد" });
        } else {
          setNameValidationError("");
          clearErrors("name");
        }
      } catch (error) {
        console.error("Error validating role name:", error);
      } finally {
        setIsValidatingName(false);
      }
    };

    const timeoutId = setTimeout(validateName, 500); // Debounce validation
    return () => clearTimeout(timeoutId);
  }, [watchedName, isEditSession, id, roleToEdit.name, setError, clearErrors]);

  const createMutation = useCreateUpdateMutation<RoleFormData>({
    mutationFn: (data) => createRole({ ...data, level: Number(data.level) }), // تبدیل به عدد
    queryKey: ["roles"],
    operation: "create",
    setError,
    onSuccess,
  });

  const updateMutation = useCreateUpdateMutation<RoleFormData & { id: number }>(
    {
      mutationFn: (data) => updateRole({ ...data, level: Number(data.level) }), // تبدیل به عدد
      queryKey: ["roles"],
      operation: "update",
      setError,
      onSuccess,
    }
  );

  const onSubmit = (data: RoleFormData) => {
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
      {/* Title Field */}
      <div className="space-y-2">
        <TextInput
          label={dictionary.forms.title}
          name="title"
          register={register}
          errors={errors}
          placeholder={dictionary.forms.title}
          disabled={isPending}
        />
      </div>

      {/* Name Field with Validation */}
      <div className="space-y-2">
        <TextInput
          label={dictionary.forms.name}
          name="name"
          register={register}
          errors={errors}
          placeholder={dictionary.forms.name}
          disabled={isPending}
        />
        {isValidatingName && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            در حال بررسی نام نقش...
          </div>
        )}
        {nameValidationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{nameValidationError}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Level Field */}
      <div className="space-y-2">
        <TextInput
          label={dictionary.forms.level}
          name="level"
          register={register}
          errors={errors}
          type="number"
          placeholder={dictionary.forms.level}
          disabled={isPending}
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <TextareaInput
          label={dictionary.forms.description + " (اختیاری)"}
          name="description"
          register={register}
          errors={errors}
          placeholder={dictionary.forms.description}
          disabled={isPending}
        />
      </div>

      {/* Systemic Field */}
      <div className="space-y-2">
        <Controller
          control={control}
          name="systemic"
          render={({ field }) => (
            <SelectField
              label={dictionary.forms.systemic}
              value={field.value || ""}
              onValueChange={field.onChange}
              options={SYSTEMIC_OPTIONS}
              placeholder={dictionary.forms.systemic}
              disabled={isPending}
              error={errors.systemic?.message}
            />
          )}
        />
      </div>

      {/* Submit Button */}
      <Button
        disabled={isPending || isValidatingName || !!nameValidationError}
        type="submit"
        className="w-full h-11 text-base"
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          isEditSession ? "ویرایش نقش" : "ایجاد نقش"
        )}
      </Button>
    </form>
  );
}
