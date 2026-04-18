import { cn } from '@/lib/utils'

export default function PageHeader({ label, title, description, className, children }) {
  return (
    <div
      className={cn(
        'bg-[#1E2D2A] rounded-3xl px-10 py-10 mb-8',
        className
      )}
    >
      {label && (
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-2">
          {label}
        </p>
      )}
      <h1 className="text-4xl font-bold text-white leading-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-gray-400 max-w-2xl text-sm">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
