"use client";

import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import TextInput from "@/components/account/input/TextInput";
import { newsletterSubscribe } from "@/core/lib/api/main/landing";
import { emailSchema, EmailSchemaData } from "@/core/schemas/newsletterSchema";
import { useDictionary } from "@/core/hooks/use-dictionary";

export default function Newsletter() {
  const { dictionary } = useDictionary();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailSchemaData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailSchemaData) => {
    try {
      const result = await newsletterSubscribe({ email: data.email });

      if (result?.status === "success") {
        toast.success(result.message);
        reset();
      } else if (result.status === "validation_error" && result.data) {
        toast.error(result.message);
        reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در ثبت");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Enter your email address"
          {...register("email")}
          className="w-full px-4 py-3 rounded-lg border-0 bg-[#525252] text-white placeholder-[#E8E8E8] focus:outline-none focus:ring-2 focus:ring-[#D4A373] transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#8B6F47] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#D4A373] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              Subscribe
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      {errors.email && (
        <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>
      )}
    </form>
  );
}
