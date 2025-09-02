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
      1: "text-4xl font-serif font-bold text-[#2F2F2F]",
      2: "text-2xl font-serif font-semibold text-[#2F2F2F]",
      3: "text-xl font-serif font-semibold text-[#2F2F2F]",
      4: "text-lg font-serif font-medium text-[#2F2F2F]",
    },
    secondary: {
      1: "text-2xl font-serif font-medium text-[#525252]",
      2: "text-xl font-serif font-medium text-[#525252]",
      3: "text-lg font-serif font-medium text-[#525252]",
      4: "text-base font-serif font-medium text-[#525252]",
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
