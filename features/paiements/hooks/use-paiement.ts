"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import type { Paiement, PaiementFormData } from "../types"
import { createNewPaiement, updatePaiementData, deletePaiementById } from "../actions"

export function usePaiement() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createPaiement = async (formData: PaiementFormData) => {
    try {
      setIsSubmitting(true)
      const paiement = await createNewPaiement(formData)

      if (paiement) {
        toast({
          title: "Paiement créé",
          description: "Le paiement a été créé avec succès.",
        })
        router.push(`/factures/${formData.factureId}`)
        router.refresh()
        return paiement
      } else {
        throw new Error("Échec de la création du paiement")
      }
    } catch (error) {
      console.error("Erreur lors de la création du paiement:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer le paiement. Veuillez réessayer.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const updatePaiement = async (id: string, updates: Partial<Paiement>) => {
    try {
      setIsSubmitting(true)
      const paiement = await updatePaiementData(id, updates)

      if (paiement) {
        toast({
          title: "Paiement mis à jour",
          description: "Le paiement a été mis à jour avec succès.",
        })
        router.refresh()
        return paiement
      } else {
        throw new Error("Échec de la mise à jour du paiement")
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du paiement ${id}:`, error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le paiement. Veuillez réessayer.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const deletePaiement = async (id: string, redirectUrl?: string) => {
    try {
      setIsSubmitting(true)
      const success = await deletePaiementById(id)

      if (success) {
        toast({
          title: "Paiement supprimé",
          description: "Le paiement a été supprimé avec succès.",
        })
        if (redirectUrl) {
          router.push(redirectUrl)
        }
        router.refresh()
        return true
      } else {
        throw new Error("Échec de la suppression du paiement")
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression du paiement ${id}:`, error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le paiement. Veuillez réessayer.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    createPaiement,
    updatePaiement,
    deletePaiement,
  }
}
