import { DashboardLayout } from "@/components/dashboard-layout"
import { PaiementForm } from "@/features/paiements/components/paiement-form"

export const metadata = {
  title: "Nouveau paiement | Invoxia",
  description: "Créez un nouveau paiement",
}

export default function NouveauPaiementPage() {
  return (
    <DashboardLayout>
      <PaiementForm />
    </DashboardLayout>
  )
}
