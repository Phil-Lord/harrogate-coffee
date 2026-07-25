export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
      {children}
    </p>
  )
}
