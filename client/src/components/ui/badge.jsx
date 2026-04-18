import { cn } from "@/lib/utils"

export function CategoryTag({ children, className }) {
  return (
    <span className={cn("border border-[#2A7A63] text-[#2A7A63] rounded-full px-3 py-1 text-xs font-medium", className)}>
      {children}
    </span>
  )
}

export function UrgencyTag({ level, className }) {
  const styles = {
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-green-100 text-green-700',
  }
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", styles[level] || styles.Low, className)}>
      {level || 'Low'}
    </span>
  )
}

export function StatusTag({ status, className }) {
  const styles = {
    Open: 'bg-blue-100 text-blue-700',
    Solved: 'bg-green-100 text-green-700',
  }
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", styles[status] || styles.Open, className)}>
      {status || 'Open'}
    </span>
  )
}

export function SkillTag({ children, className }) {
  return (
    <span className={cn("bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs", className)}>
      {children}
    </span>
  )
}

// Legacy Badge for backward compatibility
import { cva } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-[#2A7A63]/30 bg-[#2A7A63]/10 text-[#2A7A63]",
        secondary: "border-gray-200 bg-gray-100 text-gray-600",
        destructive: "border-red-200 bg-red-100 text-red-600",
        outline: "border-gray-200 text-gray-700",
        warning: "border-amber-200 bg-amber-100 text-amber-700",
        success: "border-green-200 bg-green-100 text-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { badgeVariants }
