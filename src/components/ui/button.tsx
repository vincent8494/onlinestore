import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold uppercase tracking-wide ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Gold fill, charcoal ink — the retail primary */
        default:
          "bg-primary text-primary-foreground shadow-lift-sm hover:bg-gold-deep hover:shadow-glow-gold hover:-translate-y-0.5",
        /** Alias kept so existing `variant="gradient"` call sites stay on-brand */
        gradient:
          "bg-gold-wash bg-[length:200%_auto] text-ink shadow-lift hover:bg-[position:right_center] hover:shadow-glow-gold hover:-translate-y-0.5",
        /** Charcoal fill, gold text — the inverse pairing */
        ink: "bg-ink text-gold shadow-lift-sm hover:bg-ink-soft hover:-translate-y-0.5",
        sunrise:
          "bg-sunrise bg-[length:200%_auto] text-white shadow-lift hover:bg-[position:right_center] hover:shadow-glow-orange hover:-translate-y-0.5",
        ocean:
          "bg-ocean bg-[length:200%_auto] text-white shadow-lift hover:bg-[position:right_center] hover:shadow-glow-cyan hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lift-sm hover:bg-destructive/90 hover:shadow-glow-sale hover:-translate-y-0.5",
        outline:
          "border-2 border-ink/20 bg-background hover:border-ink hover:bg-ink hover:text-gold hover:-translate-y-0.5",
        /** Gold-bordered ghost */
        "outline-gradient":
          "border-2 border-gold bg-background text-foreground hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-glow-gold",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lift-sm hover:bg-ink-soft hover:-translate-y-0.5",
        soft: "bg-muted text-foreground hover:bg-muted/70",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline hover:text-gold-ink",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-sm",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
