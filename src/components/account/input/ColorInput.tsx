"use client";

import type React from "react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/core/lib/utils";
import { UseFormRegister, FieldErrors, Path } from "react-hook-form";

interface ColorInputProps<T extends object> {
  id: string;
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  defaultValue?: string;
  disabled?: boolean;
}

export default function ColorInput<T extends object>({
  id,
  label,
  name,
  register,
  errors,
  defaultValue = "#000000",
  disabled = false,
}: ColorInputProps<T>) {
  const [color, setColor] = useState(defaultValue);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
  };

  return (
    <div className="flex flex-col gap-2 justify-end">
      {label && (
        <Label className="text-primary-600" htmlFor={id}>
          {label}
        </Label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          id={id}
          {...register(name)}
          onChange={(e) => {
            register(name).onChange(e); // Ensure form register updates
            handleColorChange(e);
          }}
          value={color}
          disabled={disabled}
          className={cn(
            "h-10 w-10 rounded-md border border-primary-300 p-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            errors &&
              errors[name as keyof FieldErrors<T>] &&
              "border-red-600 focus:ring-red-600",
            "[&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded"
          )}
        />
        <Input
          type="text"
          value={color}
          readOnly
          disabled={disabled}
          className={cn(
            "flex-1 text-sm h-10 border-primary-300 placeholder-primary-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            errors && errors[name as keyof FieldErrors<T>]
              ? "border-red-600 focus:ring-red-600"
              : "",
            "border rounded-md py-2 px-3"
          )}
        />
      </div>
      {errors && errors[name as keyof FieldErrors<T>] && (
        <p className="text-red-600 text-sm">
          {
            (errors[name as keyof FieldErrors<T>] as { message?: string })
              ?.message
          }
        </p>
      )}
    </div>
  );
}
