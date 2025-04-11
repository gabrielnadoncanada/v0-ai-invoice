import { BaseService } from "@/lib/base-service"
import { mapDbBusinessSettingsToBusinessSettings, mapBusinessSettingsToDbBusinessSettings } from "@/lib/mappers"
import type { BusinessSettings } from "@/features/settings/types"
import { checkBusinessSettingsTable, createDefaultSettings } from "./init-settings-table"

export class SettingsService extends BaseService<"business_settings"> {
  constructor() {
    super("business_settings")
  }

  async fetchBusinessSettings(): Promise<BusinessSettings | null> {
    try {
      // Vérifier d'abord si la table existe
      const tableExists = await checkBusinessSettingsTable()
      if (!tableExists) {
        console.error("La table business_settings n'existe pas")
        return null
      }

      const data = await this.findAll()
      if (!data || data.length === 0) {
        // Aucun enregistrement trouvé, essayer de créer des paramètres par défaut
        const created = await createDefaultSettings()
        if (created) {
          // Réessayer après création
          return this.fetchBusinessSettings()
        }
        return null
      }

      return mapDbBusinessSettingsToBusinessSettings(data[0])
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres de l'entreprise:", error)
      return null
    }
  }

  async updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings | null> {
    try {
      // Vérifier d'abord si la table existe
      const tableExists = await checkBusinessSettingsTable()
      if (!tableExists) {
        console.error("La table business_settings n'existe pas")
        return null
      }

      // Convertir les champs du modèle vers la structure de la base de données
      const dbUpdates = mapBusinessSettingsToDbBusinessSettings(settings)
      dbUpdates.updated_at = new Date().toISOString()

      // Vérifier si un enregistrement existe déjà
      const existingData = await this.findAll()
      const existingSettings = existingData && existingData.length > 0 ? existingData[0] : null

      let result
      if (existingSettings) {
        // Mise à jour
        result = await this.update(existingSettings.id, dbUpdates)
      } else {
        // Création
        const defaultValues = {
          name: settings.name || "Mon Entreprise",
          default_tva_rate: settings.defaultTvaRate || 20,
          invoice_prefix: settings.invoicePrefix || "FACT-",
          invoice_next_number: settings.invoiceNextNumber || 1,
          created_at: new Date().toISOString(),
        }
        result = await this.create({ ...dbUpdates, ...defaultValues })
      }

      if (!result) {
        return null
      }

      return mapDbBusinessSettingsToBusinessSettings(result)
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error)
      return null
    }
  }
}

// Exporter une instance singleton du service
export const settingsService = new SettingsService()
