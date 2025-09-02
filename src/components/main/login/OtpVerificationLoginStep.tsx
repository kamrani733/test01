"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OtpVerificationStepProps } from "@/core/types/auth";
import {
  getOtpVerificationStepSchema,
  OtpVerificationStepSchemaData,
} from "@/core/schemas/authSchema";
import CustomButton from "@/components/shared/CustomButton";
import { InputOTPPattern } from "../form/InputOTPPattern";
import { verifyCode } from "@/core/lib/api/main/auth";

interface ExtendedOtpVerificationStepProps extends OtpVerificationStepProps {
  setStep: (step: 1 | 2 | 3) => void;
  goBack: () => void;
}

export default function OtpVerificationLoginStep({
  mobile,
  session_token,
  timeLeft,
  handleResend,
  goBack,
}: ExtendedOtpVerificationStepProps) {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { dictionary } = useDictionary();
  const OtpVerificationStepSchema = getOtpVerificationStepSchema(dictionary);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<OtpVerificationStepSchemaData>({
    resolver: zodResolver(OtpVerificationStepSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (data: OtpVerificationStepSchemaData) => {
    try {
      const result = await verifyCode({
        mobile,
        session_token,
        verifyCode: data.verificationCode,
      });

      if (result?.status === "success") {
        setAuth(result.data);
        toast.success(result.message);
        router.push("/dashboard");
      } else {
        setError("verificationCode", {
          type: "server",
          message: result.message,
        });
      }
    } catch {
      toast.error(dictionary.common.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8 h-28">
        <InputOTPPattern control={control} errors={errors} />
      </div>

      <CustomButton type="submit" disabled={isSubmitting} size="full">
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <p>{dictionary.forms.login}</p>
        )}
      </CustomButton>

      <div className="grid grid-cols-2 justify-between mt-2">
        <div>
          {timeLeft > 0 ? (
            <div className="flex gap-x-2">
              <p className="select-none text-primary-600 w-fit ltr:order-2">
                {formatTime()}
              </p>
              <p className="select-none text-primary-600 w-fit">
                {dictionary.forms.resendCode}
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="cursor-pointer text-primary-600"
            >
              {dictionary.forms.resendOtp}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={goBack}
          className="text-primary-600 w-fit cursor-pointer justify-self-end"
        >
          {dictionary.forms.loginWithPassword}
        </button>
      </div>
    </form>
  );
}
