"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import NumberStepLoginForm from "./NumberStepLoginForm";
import PasswordStepLoginForm from "./PasswordStepLoginForm";
import OtpVerificationLoginStep from "./OtpVerificationLoginStep";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/core/hooks/use-dictionary";
import { requestOtp } from "@/core/lib/api/main/auth";

type Step = 1 | 2 | 3;

export default function LoginFlow() {
  const { dictionary } = useDictionary();
  const [stepHistory, setStepHistory] = useState<Step[]>([1]);
  const step = stepHistory[stepHistory.length - 1];

  const [mobile, setMobile] = useState("");
  const [sessionToken, setSessionToken] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (step !== 3 || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleResend = async () => {
    try {
      setIsLoading(true);
      await requestOtp(mobile, sessionToken);
      setTimeLeft(60);
    } catch (error) {
      console.error("Resend OTP error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (stepHistory.length > 1) {
      setStepHistory((prev) => prev.slice(0, -1));
    }
  };

  const goToStep = (nextStep: Step) => {
    setStepHistory((prev) => [...prev, nextStep]);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="flex flex-col justify-center bg-white border border-[#E8E8E8] rounded-lg shadow-sm p-5 md:p-6 lg:p-10 mx-auto w-11/12 lg:w-2/5">
        {/* Header */}
        <div className="flex justify-between mb-10">
          <Heading level={2} className="select-none">
            {dictionary.forms.login} | {dictionary.forms.signin}
          </Heading>
          {step !== 1 && (
            <Button onClick={goBack} variant="ghost">
              <ChevronRight className="w-5 h-5 ltr:rotate-180 stroke-[1]" />
              {dictionary.common.back}
            </Button>
          )}
        </div>

        {step === 1 && (
          <NumberStepLoginForm
            setMobile={setMobile}
            setSessionToken={setSessionToken}
            setRememberMe={setRememberMe}
            mobile={mobile}
            rememberMe={rememberMe}
            setStep={goToStep}
          />
        )}
        {step === 2 && (
          <PasswordStepLoginForm
            handleResend={handleResend}
            mobile={mobile}
            session_token={sessionToken}
            setStep={goToStep}
            isLoading={isLoading}
          />
        )}
        {step === 3 && (
          <OtpVerificationLoginStep
            mobile={mobile}
            session_token={sessionToken}
            handleResend={handleResend}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            goBack={goBack}
            setStep={goToStep}
          />
        )}
      </div>
    </div>
  );
}
