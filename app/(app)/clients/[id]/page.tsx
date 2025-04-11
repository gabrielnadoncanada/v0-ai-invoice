"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ClientForm } from "@/features/clients/components/client-form"
import { useClient } from "@/features/clients/hooks/use-client"

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { client, isLoading, saveClient } = useClient(params.id)

  const handleSubmit = async (data: any) => {
    await saveClient(data)
  }

  return (

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/clients")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{client?.nom || "Détails du client"}</h2>
            <p className="text-muted-foreground">Modifier les informations du client</p>
          </div>
        </div>

        <ClientForm client={client || undefined} isLoading={isLoading} onSubmit={handleSubmit} />
      </div>

  )
}
