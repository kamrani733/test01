"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useDictionary } from "@/core/hooks/use-dictionary";
import TextInput from "@/components/account/input/TextInput";
import { LoginFormProps } from "@/core/types/auth";
import { getLoginFormSchema, LoginFormData } from "@/core/schemas/authSchema";
import CustomButton from "@/components/shared/CustomButton";
import CaptchaField from "../form/CaptchaField";
import { registerStepOne } from "@/core/lib/api/main/auth";

interface ExtendedLoginFormProps extends LoginFormProps {
  setStep: (step: 1 | 2 | 3) => void;
}

export default function NumberStepLoginForm({
  setMobile,
  setSessionToken,
  setRememberMe,
  mobile,
  rememberMe,
  setStep,
}: ExtendedLoginFormProps) {
  const { dictionary } = useDictionary();
  const loginSchema = getLoginFormSchema(dictionary);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile,
      remember_me: rememberMe,
      recaptcha_token: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setMobile(data.mobile);
    setRememberMe(data.remember_me);

    try {
      const result = await registerStepOne(
        data.mobile,
        data.recaptcha_token,
        data.remember_me
      );
      console.log(result);

      if (result.status.toLowerCase() === "success") {
        setStep(result.data.step);
        setSessionToken(result.data.session_token);
      } else {
        setError("mobile", {
          type: "server",
          message: result.data.mobile ? result.data.mobile : result.message,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("mobile", { type: "client", message: dictionary.common.error });
    }
  };

  const onCaptchaChange = (token: string | null) => {
    setValue("recaptcha_token", token || "");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col mb-8">
        <div className="h-28 mb-4">
          <TextInput
            label={dictionary.forms.mobile}
            placeholder=""
            register={register}
            inputClassName="w-full"
            name="mobile"
            errors={errors}
            variant="secondary"
          />
        </div>
        <Controller
          name="remember_me"
          control={control}
          render={({ field }) => (
            <div className="flex gap-x-2 items-center text-sm mb-8">
              <Checkbox
                className="cursor-pointer m-0"
                id="remember_me"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor="remember_me" className="select-none">
                {dictionary.forms.rememberme}
              </label>
            </div>
          )}
        />
        <CaptchaField
          error={errors.recaptcha_token?.message}
          onChange={onCaptchaChange}
        />
      </div>
      <CustomButton loading={isSubmitting} type="submit" size="full">
        {dictionary.forms.next}
      </CustomButton>
    </form>
  );
}
