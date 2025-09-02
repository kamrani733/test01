import { ReactNode } from "react";
import { cn } from "../../core/lib/utils";

type Variant = "default" | "secondary";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export function Heading({
  level = 1,
  children,
  variant = "default",
  className,
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";

  const sizeMap: Record<Variant, Record<1 | 2 | 3 | 4, string>> = {
    default: {
      1: "text-xl font-primary-bold",
      2: "text-base font-primary-bold",
      3: "text-sm font-primary-bold",
      4: "text-xs font-primary-bold",
    },
    secondary: {
      1: "text-base",
      2: "text-sm",
      3: "text-xs",
      4: "",
    },
  };

  const safeVariant = sizeMap[variant] ? variant : "default";
  const safeLevel = (level >= 1 && level <= 4 ? level : 1) as 1 | 2 | 3 | 4;

  return (
    <Tag className={cn(sizeMap[safeVariant][safeLevel], className)}>
      {children}
    </Tag>
  );
}
