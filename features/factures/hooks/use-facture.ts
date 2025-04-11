"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { fetchFactureById, updateFactureData } from "@/features/factures/actions"
import type { Facture } from "@/lib/types"

export function useFacture(id?: string) {
  const [facture, setFacture] = useState<Facture | null>(null)
  const [isLoading, setIsLoading] = useState(id ? true : false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      loadFacture(id)
    }
  }, [id])

  const loadFacture = async (factureId: string) => {
    try {
      setIsLoading(true)
      const data = await fetchFactureById(factureId)
      setFacture(data)
    } catch (error) {
      console.error("Erreur lors du chargement de la facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations de la facture.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveFacture = async (data: Partial<Facture>) => {
    try {
      setIsSubmitting(true)

      if (id && facture) {
        // Mise à jour d'une facture existante
        const updatedFacture = await updateFactureData(id, data)
        if (updatedFacture) {
          setFacture(updatedFacture)
          toast({
            title: "Succès",
            description: "La facture a été mise à jour avec succès.",
          })
          return updatedFacture
        }
      } else {
        // Cette fonction ne gère pas la création de nouvelles factures
        // Utilisez createNewFacture directement pour cela
        throw new Error("ID de facture non fourni pour la mise à jour")
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la facture.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    facture,
    isLoading,
    isSubmitting,
    saveFacture,
  }
}
