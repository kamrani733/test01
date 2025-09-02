"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TextInput from "@/components/account/input/TextInput";
import TextareaInput from "@/components/account/input/TextareaInput";
import {
  PermissionFormData,
  getPermissionFormSchema,
} from "@/core/schemas/permissionSchema";
import { Permission } from "@/core/models/permission-model";
import { useDictionary } from "@/core/hooks/use-dictionary";
import {
  createPermissions,
  updatePermissions,
} from "@/core/lib/api/account/permissions";
import { useCreateUpdateMutation } from "@/core/hooks/common/useCreateUpdateMutation";

interface CreateEditPermissionFormProps {
  onSuccess: () => void;
  permissionToEdit?: Partial<Permission>;
}

export default function CreateEditPermissionForm({
  onSuccess,
  permissionToEdit = {},
}: CreateEditPermissionFormProps) {
  const { id } = permissionToEdit;
  const { dictionary } = useDictionary();
  const permissionFormSchema = getPermissionFormSchema(dictionary);
  const isEditSession = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<PermissionFormData>({
    defaultValues: {
      title: permissionToEdit.title || "",
      name: permissionToEdit.name || "",
      description:
        permissionToEdit.description === null
          ? undefined
          : permissionToEdit.description || "",
    },
    resolver: zodResolver(permissionFormSchema),
  });

  const createMutation = useCreateUpdateMutation<PermissionFormData>({
    mutationFn: createPermissions,
    queryKey: ["permissions"],
    operation: "create",
    setError,
    onSuccess,
  });

  const updateMutation = useCreateUpdateMutation<
    PermissionFormData & { id: number }
  >({
    mutationFn: updatePermissions,
    queryKey: ["permissions"],
    operation: "update",
    setError,
    onSuccess,
  });

  const onSubmit = (data: PermissionFormData) => {
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
        label={dictionary.forms.name}
        name="name"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.name}
        disabled={isPending}
      />
      <TextareaInput
        label={dictionary.forms.description}
        name="description"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.description}
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
