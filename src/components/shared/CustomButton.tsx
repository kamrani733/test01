import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/core/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#8B6F47] text-white hover:bg-[#D4A373]',
        secondary: 'bg-[#E8E8E8] text-[#2F2F2F] hover:bg-[#D4A373] hover:text-white',
        outline:
          'border-2 border-[#8B6F47] bg-transparent text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white',
        ghost:
          'shadow-none bg-transparent text-[#2F2F2F] hover:bg-[#E8E8E8] hover:text-[#2F2F2F]',
        black:
          'bg-[#2F2F2F] border-[#2F2F2F] text-white border hover:bg-[#8B6F47] hover:border-[#8B6F47]',
      },
      size: {
        sm: 'h-8 px-3 py-2 text-sm',
        default: 'h-9 px-4 py-2 text-sm',
        lg: 'h-11 text-base px-6 py-3',
        full: 'h-11 text-base px-4 py-2 w-full',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type CustomButtonProps = {
  loading?: boolean;
  children: ReactNode;
  asChild?: boolean;
} & VariantProps<typeof buttonVariants> &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'>;

export default function CustomButton({
  loading = false,
  children,
  className,
  variant = 'default',
  size = 'default',
  disabled,
  type = 'button',
  asChild = false,
}: CustomButtonProps) {
  const Comp = asChild ? Slot : Button;

  return (
    <Comp
      type={type}
      disabled={loading || disabled}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
    </Comp>
  );
}
