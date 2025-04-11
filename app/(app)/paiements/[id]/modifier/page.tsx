import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { fetchPaiementById } from "@/features/paiements/actions"
import { PaiementForm } from "@/features/paiements/components/paiement-form"
import type { PaiementFormData } from "@/features/paiements/types"

interface ModifierPaiementPageProps {
  params: {
    id: string
  }
}

export default async function ModifierPaiementPage({ params }: ModifierPaiementPageProps) {
  const paiement = await fetchPaiementById(params.id)

  if (!paiement) {
    notFound()
  }

  const initialData: PaiementFormData = {
    factureId: paiement.factureId,
    montant: paiement.montant,
    methode: paiement.methode,
    statut: paiement.statut,
    reference: paiement.reference,
    notes: paiement.notes,
    datePaiement: paiement.datePaiement,
  }

  return (
    <DashboardLayout>
      <PaiementForm paiementId={params.id} initialData={initialData} isEditing />
    </DashboardLayout>
  )
}
