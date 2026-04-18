import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#2A7A63] text-white hover:bg-[#2A7A63]/90 shadow-sm",
        dark: "bg-[#1E2D2A] text-white hover:bg-[#1E2D2A]/90",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900",
        ghost: "hover:bg-gray-100 text-gray-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        link: "text-[#2A7A63] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-9 px-3 text-xs rounded-lg",
        lg: "h-12 px-6 py-3 rounded-full text-sm",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
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
