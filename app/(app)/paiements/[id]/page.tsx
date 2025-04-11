import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { fetchPaiementById } from "@/features/paiements/actions"
import { PaiementDetail } from "@/features/paiements/components/paiement-detail"

interface PaiementDetailPageProps {
  params: {
    id: string
  }
}

export default async function PaiementDetailPage({ params }: PaiementDetailPageProps) {
  const paiement = await fetchPaiementById(params.id)

  if (!paiement) {
    notFound()
  }

  return (
    <DashboardLayout>
      <PaiementDetail paiement={paiement} />
    </DashboardLayout>
  )
}
