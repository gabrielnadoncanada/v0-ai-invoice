"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BusinessSettingsForm } from "@/features/settings/components/business-settings-form"
import { SettingsError } from "@/features/settings/components/settings-error"
import { TableMissingError } from "@/features/settings/components/table-missing-error"
import { useBusinessSettings } from "@/features/settings/hooks/use-business-settings"

export default function ParametresPage() {
  const { settings, isLoading, error, isTableMissing, saveSettings, reloadSettings } = useBusinessSettings()

  const handleSubmit = async (data: any) => {
    await saveSettings(data)
  }

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground">Configurez les paramètres de votre entreprise</p>
        </div>

        {isTableMissing ? (
          <TableMissingError onRetry={reloadSettings} />
        ) : error ? (
          <SettingsError message={error} onRetry={reloadSettings} />
        ) : (
          <BusinessSettingsForm settings={settings} isLoading={isLoading} onSubmit={handleSubmit} />
        )}
      </div>
  )
}
