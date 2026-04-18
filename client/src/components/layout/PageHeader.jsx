import { cn } from '@/lib/utils'

export default function PageHeader({ label, title, description, className }) {
  return (
    <div
      className={cn(
        'bg-accent text-accent-foreground rounded-2xl px-8 py-8 mb-8',
        className
      )}
    >
      {label && (
        <p className="text-xs font-semibold tracking-widest uppercase text-accent-foreground/60 mb-2">
          {label}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
      {description && (
        <p className="mt-2 text-accent-foreground/70 max-w-2xl text-sm sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
