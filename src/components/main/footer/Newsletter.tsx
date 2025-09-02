"use client";

import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/Heading";
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
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در ثبت");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-4">
      <Heading level={3} className="mb-4 text-[#F5F5F5]">
        {dictionary.ui.newsletter.title}
      </Heading>
      <p className="text-[#F5F5F5]/80 mb-1">
        {dictionary.ui.newsletter.description}
      </p>
      <div className="h-20 relative">
        <TextInput
          label=""
          placeholder={dictionary.ui.newsletter.placeholder}
          errors={errors}
          register={register}
          name={"email"}
          variant="secondary"
          inputClassName="w-full"
        />
        <button
          type="submit"
          className="absolute top-1/7 rtl:left-2 ltr:right-2 p-1 rounded-full hover:bg-[#8B6F47]/20 transition-colors duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 animate-spin text-[#D4A373]" />
          ) : (
            <Send className="w-4 h-4 text-[#D4A373] rtl:rotate-270" />
          )}
        </button>
      </div>
    </form>
  );
}
