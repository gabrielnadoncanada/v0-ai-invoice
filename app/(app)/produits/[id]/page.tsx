"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ProduitForm } from "@/features/produits/components/produit-form"
import { useProduit } from "@/features/produits/hooks/use-produit"

export default function ProduitDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { produit, isLoading, saveProduit } = useProduit(params.id)

  const handleSubmit = async (data: any) => {
    await saveProduit(data)
  }

  return (
   
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/produits")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{produit?.nom || "Détails du produit"}</h2>
            <p className="text-muted-foreground">Modifier les informations du produit</p>
          </div>
        </div>

        <ProduitForm produit={produit || undefined} isLoading={isLoading} onSubmit={handleSubmit} />
      </div>
  
  )
}
