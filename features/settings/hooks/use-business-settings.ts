"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { fetchBusinessSettings, updateBusinessSettings } from "../actions"
import { checkBusinessSettingsTable } from "../api/init-settings-table"
import type { BusinessSettings } from "../types"

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTableMissing, setIsTableMissing] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setIsTableMissing(false)

      // Vérifier d'abord si la table existe
      const tableExists = await checkBusinessSettingsTable()
      if (!tableExists) {
        setIsTableMissing(true)
        setIsLoading(false)
        return
      }

      const data = await fetchBusinessSettings()

      if (data) {
        setSettings(data)
      } else {
        // Si aucun paramètre n'est trouvé, on utilise des valeurs par défaut
        setSettings({
          id: "default",
          name: "Mon Entreprise",
          defaultTvaRate: 20,
          invoicePrefix: "FACT-",
          invoiceNextNumber: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    } catch (err) {
      console.error("Erreur lors du chargement des paramètres:", err)
      setError("Impossible de charger les paramètres de l'entreprise.")
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres de l'entreprise.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async (data: Partial<BusinessSettings>) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Vérifier d'abord si la table existe
      const tableExists = await checkBusinessSettingsTable()
      if (!tableExists) {
        setIsTableMissing(true)
        return null
      }

      const updatedSettings = await updateBusinessSettings(data)

      if (updatedSettings) {
        setSettings(updatedSettings)
        toast({
          title: "Succès",
          description: "Les paramètres ont été mis à jour avec succès.",
        })
        return updatedSettings
      } else {
        throw new Error("Impossible d'enregistrer les paramètres.")
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement des paramètres:", err)
      setError("Impossible d'enregistrer les paramètres.")
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres.",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    settings,
    isLoading,
    isSubmitting,
    error,
    isTableMissing,
    saveSettings,
    reloadSettings: loadSettings,
  }
}
