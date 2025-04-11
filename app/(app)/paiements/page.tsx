import { Suspense } from "react"
import { PaiementsList } from "@/features/paiements/components/paiements-list"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "Paiements | Invoxia",
  description: "Gérez vos paiements",
}

export default function PaiementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paiements</h2>
        <p className="text-muted-foreground">Gérez les paiements de vos factures</p>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des paiements...</span>
          </div>
        }
      >
        <PaiementsList />
      </Suspense>
    </div>
  )
}
