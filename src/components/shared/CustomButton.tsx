import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/core/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary-900 text-primary-0 hover:bg-primary-0 hover:border hover:border-primary-900 hover:text-primary-900',
        secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-100/80',
        outline:
          'border border-input bg-primary-0 hover:bg-primary-100 text-primary-900',
        ghost:
          'shadow-none bg-primary-0 text-primary-900 hover:bg-primary-100 hover:text-primary-900',
        black:
          'bg-primary-900 border-primary-900 text-primary-0 border hover:bg-primary-900',
      },
      size: {
        sm: 'h-8 px-3 py-2 text-sm',
        default: 'h-9 px-4 py-2 text-sm',
        lg: 'h-11 text-base px-4 py-2',
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
