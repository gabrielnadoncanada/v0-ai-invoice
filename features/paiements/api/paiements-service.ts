import { createServerSupabaseClient } from "@/lib/supabase"
import type { Paiement, PaiementFilters } from "../types"

export async function fetchPaiements(filters?: PaiementFilters): Promise<Paiement[]> {
  try {
    const supabase = createServerSupabaseClient()
    let query = supabase.from("paiements").select("*").order("date_paiement", { ascending: false })

    // Appliquer les filtres si présents
    if (filters) {
      if (filters.clientId) {
        query = query.eq("client_id", filters.clientId)
      }
      if (filters.factureId) {
        query = query.eq("facture_id", filters.factureId)
      }
      if (filters.statut) {
        query = query.eq("statut", filters.statut)
      }
      if (filters.methode) {
        query = query.eq("methode", filters.methode)
      }
      if (filters.dateDebut) {
        query = query.gte("date_paiement", filters.dateDebut.toISOString())
      }
      if (filters.dateFin) {
        query = query.lte("date_paiement", filters.dateFin.toISOString())
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Erreur lors de la récupération des paiements:", error)
      return []
    }

    return data.map((paiement) => ({
      id: paiement.id,
      factureId: paiement.facture_id,
      factureNumero: paiement.facture_numero,
      clientId: paiement.client_id,
      clientNom: paiement.client_nom,
      montant: paiement.montant,
      methode: paiement.methode,
      statut: paiement.statut,
      reference: paiement.reference || undefined,
      notes: paiement.notes || undefined,
      datePaiement: new Date(paiement.date_paiement),
      dateCreation: new Date(paiement.date_creation),
    }))
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error)
    return []
  }
}

export async function fetchPaiementById(id: string): Promise<Paiement | null> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("paiements").select("*").eq("id", id).single()

    if (error) {
      console.error(`Erreur lors de la récupération du paiement ${id}:`, error)
      return null
    }

    return {
      id: data.id,
      factureId: data.facture_id,
      factureNumero: data.facture_numero,
      clientId: data.client_id,
      clientNom: data.client_nom,
      montant: data.montant,
      methode: data.methode,
      statut: data.statut,
      reference: data.reference || undefined,
      notes: data.notes || undefined,
      datePaiement: new Date(data.date_paiement),
      dateCreation: new Date(data.date_creation),
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération du paiement ${id}:`, error)
    return null
  }
}

export async function fetchPaiementsByFactureId(factureId: string): Promise<Paiement[]> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("paiements")
      .select("*")
      .eq("facture_id", factureId)
      .order("date_paiement", { ascending: false })

    if (error) {
      console.error(`Erreur lors de la récupération des paiements pour la facture ${factureId}:`, error)
      return []
    }

    return data.map((paiement) => ({
      id: paiement.id,
      factureId: paiement.facture_id,
      factureNumero: paiement.facture_numero,
      clientId: paiement.client_id,
      clientNom: paiement.client_nom,
      montant: paiement.montant,
      methode: paiement.methode,
      statut: paiement.statut,
      reference: paiement.reference || undefined,
      notes: paiement.notes || undefined,
      datePaiement: new Date(paiement.date_paiement),
      dateCreation: new Date(paiement.date_creation),
    }))
  } catch (error) {
    console.error(`Erreur lors de la récupération des paiements pour la facture ${factureId}:`, error)
    return []
  }
}

export async function createPaiement(paiementData: Omit<Paiement, "id" | "dateCreation">): Promise<Paiement> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("paiements")
      .insert({
        facture_id: paiementData.factureId,
        facture_numero: paiementData.factureNumero,
        client_id: paiementData.clientId,
        client_nom: paiementData.clientNom,
        montant: paiementData.montant,
        methode: paiementData.methode,
        statut: paiementData.statut,
        reference: paiementData.reference || null,
        notes: paiementData.notes || null,
        date_paiement: paiementData.datePaiement.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Erreur lors de la création du paiement:", error)
      throw new Error(`Erreur lors de la création du paiement: ${error.message}`)
    }

    return {
      id: data.id,
      factureId: data.facture_id,
      factureNumero: data.facture_numero,
      clientId: data.client_id,
      clientNom: data.client_nom,
      montant: data.montant,
      methode: data.methode,
      statut: data.statut,
      reference: data.reference || undefined,
      notes: data.notes || undefined,
      datePaiement: new Date(data.date_paiement),
      dateCreation: new Date(data.date_creation),
    }
  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error)
    throw error
  }
}

export async function updatePaiement(id: string, updates: Partial<Paiement>): Promise<Paiement | null> {
  try {
    const supabase = createServerSupabaseClient()
    const updateData: any = {}

    if (updates.montant !== undefined) updateData.montant = updates.montant
    if (updates.methode !== undefined) updateData.methode = updates.methode
    if (updates.statut !== undefined) updateData.statut = updates.statut
    if (updates.reference !== undefined) updateData.reference = updates.reference
    if (updates.notes !== undefined) updateData.notes = updates.notes
    if (updates.datePaiement !== undefined) updateData.date_paiement = updates.datePaiement.toISOString()

    const { data, error } = await supabase.from("paiements").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error(`Erreur lors de la mise à jour du paiement ${id}:`, error)
      return null
    }

    return {
      id: data.id,
      factureId: data.facture_id,
      factureNumero: data.facture_numero,
      clientId: data.client_id,
      clientNom: data.client_nom,
      montant: data.montant,
      methode: data.methode,
      statut: data.statut,
      reference: data.reference || undefined,
      notes: data.notes || undefined,
      datePaiement: new Date(data.date_paiement),
      dateCreation: new Date(data.date_creation),
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du paiement ${id}:`, error)
    return null
  }
}

export async function deletePaiement(id: string): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from("paiements").delete().eq("id", id)

    if (error) {
      console.error(`Erreur lors de la suppression du paiement ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Erreur lors de la suppression du paiement ${id}:`, error)
    return false
  }
}
