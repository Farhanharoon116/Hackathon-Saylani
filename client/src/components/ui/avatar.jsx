import { cn } from "@/lib/utils"

const colors = ['bg-[#2A7A63]', 'bg-amber-500', 'bg-gray-500', 'bg-rose-500', 'bg-indigo-500']

function getColor(name, index) {
  if (typeof index === 'number') return colors[index % colors.length]
  if (!name) return colors[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ name, size = "md", className, index }) {
  const sizeClasses = {
    xs: "w-7 h-7 text-xs",
    sm: "w-9 h-9 text-sm",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-lg",
    xl: "w-20 h-20 text-2xl",
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-bold shrink-0",
        getColor(name, index),
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
