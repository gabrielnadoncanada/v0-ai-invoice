import { BaseService } from "@/lib/base-service"
import type { Facture } from "@/lib/types"
import { createServerSupabaseClient } from "@/lib/supabase"

export class FacturesService extends BaseService<"factures"> {
  constructor() {
    super("factures")
  }

  async fetchFactures(): Promise<Facture[]> {
    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from("factures").select("*").order("date_emission", { ascending: false })

      if (error) {
        console.error("Erreur lors de la récupération des factures:", error)
        return []
      }

      return data.map((facture) => ({
        id: facture.id,
        numero: facture.numero,
        clientId: facture.client_id,
        clientNom: facture.client_nom,
        dateEmission: new Date(facture.date_emission),
        dateEcheance: new Date(facture.date_echeance),
        montantHT: facture.montant_ht,
        montantTTC: facture.montant_ttc,
        statut: facture.statut,
        notes: facture.notes || undefined,
        conditionsPaiement: facture.conditions_paiement || undefined,
        lignes: [], // Les lignes seront chargées séparément
      }))
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error)
      return []
    }
  }

  async fetchFactureById(id: string): Promise<Facture | null> {
    const supabase = createServerSupabaseClient()

    // Récupérer la facture
    const { data: facture, error: factureError } = await supabase.from("factures").select("*").eq("id", id).single()

    if (factureError) {
      console.error(`Erreur lors de la récupération de la facture ${id}:`, factureError)
      return null
    }

    // Récupérer les lignes de la facture
    const { data: lignes, error: lignesError } = await supabase.from("lignes_facture").select("*").eq("facture_id", id)

    if (lignesError) {
      console.error(`Erreur lors de la récupération des lignes de la facture ${id}:`, lignesError)
      return null
    }

    // Construire l'objet Facture avec ses lignes
    return {
      id: facture.id,
      numero: facture.numero,
      clientId: facture.client_id,
      clientNom: facture.client_nom,
      dateEmission: new Date(facture.date_emission),
      dateEcheance: new Date(facture.date_echeance),
      lignes: lignes.map((ligne) => ({
        id: ligne.id,
        produitId: ligne.produit_id,
        produitNom: ligne.produit_nom,
        quantite: ligne.quantite,
        prixUnitaire: ligne.prix_unitaire,
        tva: ligne.tva,
        remise: ligne.remise || undefined,
        montantHT: ligne.montant_ht,
        montantTTC: ligne.montant_ttc,
      })),
      montantHT: facture.montant_ht,
      montantTTC: facture.montant_ttc,
      statut: facture.statut,
      notes: facture.notes || undefined,
      conditionsPaiement: facture.conditions_paiement || undefined,
    }
  }

  async createFacture(factureData: Omit<Facture, "id">): Promise<Facture> {
    const supabase = createServerSupabaseClient()

    // Insérer la facture
    const { data: facture, error: factureError } = await supabase
      .from("factures")
      .insert({
        numero: factureData.numero,
        client_id: factureData.clientId,
        client_nom: factureData.clientNom,
        date_emission: factureData.dateEmission.toISOString(),
        date_echeance: factureData.dateEcheance.toISOString(),
        montant_ht: factureData.montantHT,
        montant_ttc: factureData.montantTTC,
        statut: factureData.statut,
        notes: factureData.notes || null,
        conditions_paiement: factureData.conditionsPaiement || null,
      })
      .select()
      .single()

    if (factureError) {
      console.error("Erreur lors de la création de la facture:", factureError)
      throw new Error(`Erreur lors de la création de la facture: ${factureError.message}`)
    }

    // Si la facture a des lignes, les insérer
    if (factureData.lignes && factureData.lignes.length > 0) {
      const lignesInsert = factureData.lignes.map((ligne) => ({
        facture_id: facture.id,
        produit_id: ligne.produitId,
        produit_nom: ligne.produitNom,
        quantite: ligne.quantite,
        prix_unitaire: ligne.prixUnitaire,
        tva: ligne.tva,
        remise: ligne.remise || null,
        montant_ht: ligne.montantHT,
        montant_ttc: ligne.montantTTC,
      }))

      const { error: lignesError } = await supabase.from("lignes_facture").insert(lignesInsert)

      if (lignesError) {
        console.error("Erreur lors de la création des lignes de facture:", lignesError)
        // On ne lance pas d'erreur ici pour ne pas bloquer la création de la facture
      }
    }

    // Retourner la facture créée
    return {
      id: facture.id,
      numero: facture.numero,
      clientId: facture.client_id,
      clientNom: facture.client_nom,
      dateEmission: new Date(facture.date_emission),
      dateEcheance: new Date(facture.date_echeance),
      lignes: factureData.lignes || [],
      montantHT: facture.montant_ht,
      montantTTC: facture.montant_ttc,
      statut: facture.statut,
      notes: facture.notes || undefined,
      conditionsPaiement: facture.conditions_paiement || undefined,
    }
  }

  async updateFacture(id: string, updates: Partial<Facture>): Promise<Facture | null> {
    const supabase = createServerSupabaseClient()

    // Récupérer la facture existante
    const existingFacture = await this.fetchFactureById(id)
    if (!existingFacture) {
      return null
    }

    // Préparer les mises à jour pour la facture
    const factureUpdates: any = {}
    if (updates.numero !== undefined) factureUpdates.numero = updates.numero
    if (updates.clientId !== undefined) factureUpdates.client_id = updates.clientId
    if (updates.clientNom !== undefined) factureUpdates.client_nom = updates.clientNom
    if (updates.dateEmission !== undefined) factureUpdates.date_emission = updates.dateEmission.toISOString()
    if (updates.dateEcheance !== undefined) factureUpdates.date_echeance = updates.dateEcheance.toISOString()
    if (updates.montantHT !== undefined) factureUpdates.montant_ht = updates.montantHT
    if (updates.montantTTC !== undefined) factureUpdates.montant_ttc = updates.montantTTC
    if (updates.statut !== undefined) factureUpdates.statut = updates.statut
    if (updates.notes !== undefined) factureUpdates.notes = updates.notes
    if (updates.conditionsPaiement !== undefined) factureUpdates.conditions_paiement = updates.conditionsPaiement

    // Mettre à jour la facture
    if (Object.keys(factureUpdates).length > 0) {
      const { error: updateError } = await supabase.from("factures").update(factureUpdates).eq("id", id)

      if (updateError) {
        console.error(`Erreur lors de la mise à jour de la facture ${id}:`, updateError)
        return null
      }
    }

    // Si les lignes sont mises à jour
    if (updates.lignes !== undefined) {
      // Supprimer les lignes existantes
      const { error: deleteError } = await supabase.from("lignes_facture").delete().eq("facture_id", id)

      if (deleteError) {
        console.error(`Erreur lors de la suppression des lignes de la facture ${id}:`, deleteError)
        return null
      }

      // Insérer les nouvelles lignes
      if (updates.lignes.length > 0) {
        const lignesInsert = updates.lignes.map((ligne) => ({
          facture_id: id,
          produit_id: ligne.produitId,
          produit_nom: ligne.produitNom,
          quantite: ligne.quantite,
          prix_unitaire: ligne.prixUnitaire,
          tva: ligne.tva,
          remise: ligne.remise || null,
          montant_ht: ligne.montantHT,
          montant_ttc: ligne.montantTTC,
        }))

        const { error: insertError } = await supabase.from("lignes_facture").insert(lignesInsert)

        if (insertError) {
          console.error(`Erreur lors de l'insertion des nouvelles lignes de la facture ${id}:`, insertError)
          return null
        }
      }
    }

    // Récupérer la facture mise à jour
    return this.fetchFactureById(id)
  }

  async deleteFacture(id: string): Promise<boolean> {
    const supabase = createServerSupabaseClient()

    // Les lignes de facture seront supprimées automatiquement grâce à la contrainte ON DELETE CASCADE
    const { error } = await supabase.from("factures").delete().eq("id", id)

    if (error) {
      console.error(`Erreur lors de la suppression de la facture ${id}:`, error)
      return false
    }

    return true
  }
}

// Exporter une instance singleton du service
export const facturesService = new FacturesService()

// Exporter les fonctions nommées requises
export const fetchFactures = () => facturesService.fetchFactures()
export const fetchFactureById = (id: string) => facturesService.fetchFactureById(id)
export const createFacture = (factureData: Omit<Facture, "id">) => facturesService.createFacture(factureData)
export const updateFacture = (id: string, updates: Partial<Facture>) => facturesService.updateFacture(id, updates)
export const deleteFacture = (id: string) => facturesService.deleteFacture(id)
