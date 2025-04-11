"use server"

import {
  fetchPaiements as fetchPaiementsService,
  fetchPaiementById as fetchPaiementByIdService,
  fetchPaiementsByFactureId as fetchPaiementsByFactureIdService,
  createPaiement as createPaiementService,
  updatePaiement as updatePaiementService,
  deletePaiement as deletePaiementService,
} from "./api/paiements-service"
import { fetchFactureById, updateFactureData } from "@/features/factures/actions"
import type { Paiement, PaiementFilters, PaiementFormData } from "./types"

export async function fetchPaiements(filters?: PaiementFilters): Promise<Paiement[]> {
  return fetchPaiementsService(filters)
}

export async function fetchPaiementById(id: string): Promise<Paiement | null> {
  return fetchPaiementByIdService(id)
}

export async function fetchPaiementsByFactureId(factureId: string): Promise<Paiement[]> {
  return fetchPaiementsByFactureIdService(factureId)
}

export async function createNewPaiement(formData: PaiementFormData): Promise<Paiement | null> {
  try {
    // Récupérer les informations de la facture
    const facture = await fetchFactureById(formData.factureId)
    if (!facture) {
      throw new Error("Facture introuvable")
    }

    // Créer le paiement
    const paiementData: Omit<Paiement, "id" | "dateCreation"> = {
      ...formData,
      factureNumero: facture.numero,
      clientId: facture.clientId,
      clientNom: facture.clientNom,
    }

    const paiement = await createPaiementService(paiementData)

    // Mettre à jour le statut de la facture si le paiement est complet
    if (paiement.statut === "complete") {
      // Vérifier si le montant total des paiements couvre le montant de la facture
      const paiements = await fetchPaiementsByFactureIdService(facture.id)
      const totalPaye = paiements.reduce((sum, p) => {
        return p.statut === "complete" ? sum + p.montant : sum
      }, 0)

      // Si le montant payé est supérieur ou égal au montant de la facture, marquer comme payée
      if (totalPaye >= facture.montantTTC && facture.statut !== "payée") {
        await updateFactureData(facture.id, { statut: "payée" })
      }
    }

    return paiement
  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error)
    return null
  }
}

export async function updatePaiementData(id: string, updates: Partial<Paiement>): Promise<Paiement | null> {
  try {
    const paiement = await updatePaiementService(id, updates)

    // Si le statut a changé, vérifier s'il faut mettre à jour le statut de la facture
    if (paiement && updates.statut) {
      const facture = await fetchFactureById(paiement.factureId)
      if (facture) {
        // Vérifier si le montant total des paiements couvre le montant de la facture
        const paiements = await fetchPaiementsByFactureIdService(facture.id)
        const totalPaye = paiements.reduce((sum, p) => {
          return p.statut === "complete" ? sum + p.montant : sum
        }, 0)

        // Mettre à jour le statut de la facture en fonction du total payé
        if (totalPaye >= facture.montantTTC && facture.statut !== "payée") {
          await updateFactureData(facture.id, { statut: "payée" })
        } else if (totalPaye < facture.montantTTC && facture.statut === "payée") {
          await updateFactureData(facture.id, { statut: "envoyée" })
        }
      }
    }

    return paiement
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du paiement ${id}:`, error)
    return null
  }
}

export async function deletePaiementById(id: string): Promise<boolean> {
  try {
    // Récupérer le paiement avant de le supprimer pour avoir l'ID de la facture
    const paiement = await fetchPaiementByIdService(id)
    if (!paiement) {
      return false
    }

    const success = await deletePaiementService(id)

    if (success) {
      // Mettre à jour le statut de la facture si nécessaire
      const facture = await fetchFactureById(paiement.factureId)
      if (facture && facture.statut === "payée") {
        // Vérifier si le montant total des paiements restants couvre le montant de la facture
        const paiements = await fetchPaiementsByFactureIdService(facture.id)
        const totalPaye = paiements.reduce((sum, p) => {
          return p.statut === "complete" ? sum + p.montant : sum
        }, 0)

        // Si le montant payé est inférieur au montant de la facture, changer le statut
        if (totalPaye < facture.montantTTC) {
          await updateFactureData(facture.id, { statut: "envoyée" })
        }
      }
    }

    return success
  } catch (error) {
    console.error(`Erreur lors de la suppression du paiement ${id}:`, error)
    return false
  }
}
