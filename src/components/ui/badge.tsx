import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-gold-deep",
        /** Gold sweep — reserve for the loudest signals */
        gradient: "border-transparent bg-gold-wash text-ink shadow-lift-sm",
        /** Sale / discount — the red corner flag */
        hot: "border-transparent bg-sale text-white shadow-glow-sale",
        /** New arrival */
        /* Lime is too bright for white text — use the dark ink instead */
        fresh: "border-transparent bg-brand-lime text-[hsl(236_44%_10%)] shadow-glow-lime",
        /** In stock / success */
        success: "border-transparent bg-brand-teal text-white",
        /** Low stock / attention */
        warning: "border-transparent bg-brand-amber text-white",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        /** Soft tinted chips, one per hue */
        blue: "border-brand-blue/25 bg-brand-blue/10 text-brand-blue",
        violet: "border-brand-violet/25 bg-brand-violet/10 text-brand-violet",
        pink: "border-brand-pink/25 bg-brand-pink/10 text-brand-pink",
        amber: "border-brand-amber/25 bg-brand-amber/10 text-brand-amber",
        teal: "border-brand-teal/25 bg-brand-teal/10 text-brand-teal",
        lime: "border-brand-lime/25 bg-brand-lime/10 text-brand-lime",
        orange: "border-brand-orange/25 bg-brand-orange/10 text-brand-orange",
        cyan: "border-brand-cyan/25 bg-brand-cyan/10 text-brand-cyan",
        rose: "border-brand-rose/25 bg-brand-rose/10 text-brand-rose",
        indigo: "border-brand-indigo/25 bg-brand-indigo/10 text-brand-indigo",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
