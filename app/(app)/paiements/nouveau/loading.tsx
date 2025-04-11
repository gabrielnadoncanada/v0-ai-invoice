import { DashboardLayout } from "@/components/dashboard-layout"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    </DashboardLayout>
  )
}
