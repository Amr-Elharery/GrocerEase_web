import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success:
          'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        warning:
          'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        danger:
          'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
        info: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
