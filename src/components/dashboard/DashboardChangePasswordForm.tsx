"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useDictionary } from "@/core/hooks/use-dictionary";
import {
  getPasswordFormSchema,
  PasswordFormData,
} from "@/core/schemas/passwordSchema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import PasswordInput from "../account/input/PasswordInput";
import { changePassword } from "@/core/lib/api/main/user";

export default function DashboardChangePasswordForm() {
  const { dictionary } = useDictionary();
  const passwordFormSchema = getPasswordFormSchema(dictionary);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const result = await changePassword(data as PasswordFormData);
      console.log("result in onSubmit:", result);

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as keyof PasswordFormData, {
              type: "server",
              message: messages.join("، "),
            });
          }
        });
        toast.error(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(dictionary.common.error);
    }
  };

  return (
    <form
      className="flex flex-col gap-10 max-w-1/2 mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PasswordInput
        label={dictionary.forms.password}
        name="password"
        register={register}
        errors={errors}
        placeholder=""
        disabled={isSubmitting}
        variant="secondary"
      />
      <PasswordInput
        label={dictionary.forms.confirmPassword}
        name="password_confirmation"
        register={register}
        errors={errors}
        placeholder=""
        disabled={isSubmitting}
        variant="secondary"
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        variant={"secondary"}
        className="mx-auto px-16"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          dictionary.common.submit
        )}
      </Button>
    </form>
  );
}
