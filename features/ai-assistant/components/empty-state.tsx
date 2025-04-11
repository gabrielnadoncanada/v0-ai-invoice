import { Bot } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = "Comment puis-je vous aider ?",
  description = "Posez-moi des questions sur vos factures, clients ou produits. Je peux vous aider à gérer votre entreprise.",
}: EmptyStateProps) {
  return (
    <div className="flex h-[calc(100vh-13rem)] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Bot className="h-10 w-10" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
