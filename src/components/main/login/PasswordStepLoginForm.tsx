"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/authContext";
import { toast } from "sonner";
import { useDictionary } from "@/core/hooks/use-dictionary";
import PasswordInput from "@/components/account/input/PasswordInput";
import { PasswordLoginStepProps } from "@/core/types/auth";
import {
  getPasswordLoginSchema,
  PasswordLoginData,
} from "@/core/schemas/authSchema";
import CustomButton from "@/components/shared/CustomButton";
import { loginWithPassword } from "@/core/lib/api/main/auth";

// اضافه کردن props برای setStep و goBack
interface ExtendedPasswordLoginStepProps extends PasswordLoginStepProps {
  setStep: (step: 1 | 2 | 3) => void;

  isLoading?: boolean;
}

export default function PasswordStepLoginForm({
  handleResend,
  mobile,
  session_token,
  setStep,

  isLoading,
}: ExtendedPasswordLoginStepProps) {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { dictionary } = useDictionary();
  const passwordSchema = getPasswordLoginSchema(dictionary);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordLoginData>({
    resolver: zodResolver(passwordSchema),
  });

  const handlePasswordLogin = async (data: PasswordLoginData) => {
    try {
      const result = await loginWithPassword({
        mobile,
        password: data.password,
        session_token,
      });

      if (result?.status === "success") {
        setAuth(result.data);
        toast.success(result.message);
        router.push("/dashboard");
      } else {
        setError("password", { type: "server", message: result.message });
      }
    } catch (error) {
      console.error("Password login error:", error);
      toast.error(dictionary.common.error);
    }
  };

  const handleOtpLogin = async () => {
    try {
      await handleResend();
      setStep(3);
    } catch (error) {
      console.error("Failed to resend OTP code:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handlePasswordLogin)} className="w-full">
      <div className="flex flex-col w-full mb-8 h-24">
        <PasswordInput
          placeholder=""
          errors={errors}
          name="password"
          register={register}
          disabled={isSubmitting || isLoading}
          label={dictionary.forms.password}
          variant="secondary"
        />
      </div>

      <CustomButton
        type="submit"
        disabled={isSubmitting || isLoading}
        loading={isSubmitting}
        size="full"
      >
        {dictionary.forms.login}
      </CustomButton>

      <button
        type="button"
        onClick={handleOtpLogin}
        className="cursor-pointer mt-2"
      >
        {dictionary.forms.otpLogin}
      </button>
    </form>
  );
}
