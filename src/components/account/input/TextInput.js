import { cn } from "@/core/lib/utils";
export default function TextInput({
  label,
  name,
  register,
  errors,
  placeholder,
  disabled = false,
  type = "text",
  inputClassName = "",
  variant = "default",
}) {
  const getNestedError = (name, errors) => {
    return name.split(".").reduce((acc, key) => acc?.[key], errors);
  };

  const error = getNestedError(name, errors);

  return (
    <div
      className={cn(
        "flex flex-col justify-end",
        variant === "default" ? "gap-2" : ""
      )}
    >
      {label && (
        <label className="text-primary-600" htmlFor={name}>
          {label}
        </label>
      )}

      <input
        {...register(name)}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "text-sm h-10 border-primary-300 placeholder-primary-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-0 focus:border-primary-700",
          error ? "border-red-600" : "",
          inputClassName,
          variant === "default" ? "border rounded-md py-2 px-3" : "border-b"
        )}
      />
      {error && <p className="text-red-600">{error.message}</p>}
    </div>
  );
}
