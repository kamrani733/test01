"use client";
import { cn } from "@/core/lib/utils";
import type { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { WidgetFormData } from "@/core/schemas/widgetSchema";

type Props<TFieldValues extends FieldValues = WidgetFormData> = {
  label?: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  errors?: Record<string, unknown>;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  inputClassName?: string;
  variant?: "default" | "borderless";
};

export default function TextareaInput<
  TFieldValues extends FieldValues = WidgetFormData
>({
  label,
  name,
  register,
  errors,
  placeholder,
  disabled = false,
  rows = 3,
  inputClassName = "",
  variant = "default",
}: Props<TFieldValues>) {
  const getNestedError = (name: string, errors?: Record<string, unknown>) =>
    name.split(".").reduce<unknown>((acc, key) => {
      if (acc && typeof acc === "object" && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, errors);

  const error = getNestedError(name, errors) as
    | { message?: string }
    | undefined;

  return (
    <div
      className={cn(
        "relative flex flex-col justify-end",
        variant === "default" ? "gap-2" : ""
      )}
    >
      {label && (
        <label className="text-primary-600" htmlFor={name}>
          {label}
        </label>
      )}

      <textarea
        {...register(name)}
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "text-sm border border-primary-300 min-h-18 placeholder-primary-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-0 focus:border-primary-700 resize-y",
          error ? "border-red-600" : "",
          inputClassName,
          variant === "default" ? "rounded-md py-2 px-3" : "border-b"
        )}
      />
      {error?.message && <p className="text-red-600">{error.message}</p>}
    </div>
  );
}
