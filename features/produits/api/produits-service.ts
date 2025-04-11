import { BaseService } from "@/lib/base-service"
import { mapDbProduitToProduit, mapProduitToDbProduit } from "@/lib/mappers"
import type { Produit } from "@/lib/types"
import { createServerSupabaseClient } from "@/lib/supabase"

export class ProduitsService extends BaseService<"produits"> {
  constructor() {
    super("produits")
  }

  async fetchProduits(includeInactive = false): Promise<Produit[]> {
    try {
      const data = await this.findAll({ orderBy: "nom" })
      return data.map(mapDbProduitToProduit)
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error)
      return []
    }
  }

  async fetchProduitById(id: string): Promise<Produit | null> {
    const data = await this.findById(id)
    if (!data) return null
    return mapDbProduitToProduit(data)
  }

  async createProduit(produit: Omit<Produit, "id" | "dateCreation">): Promise<Produit> {
    const dbProduit = mapProduitToDbProduit(produit)
    const data = await this.create(dbProduit)
    return mapDbProduitToProduit(data)
  }

  async updateProduit(id: string, updates: Partial<Produit>): Promise<Produit | null> {
    const dbUpdates = mapProduitToDbProduit(updates)
    const data = await this.update(id, dbUpdates)
    if (!data) return null
    return mapDbProduitToProduit(data)
  }

  async deleteProduit(id: string): Promise<{ success: boolean; message?: string }> {
    const supabase = createServerSupabaseClient()

    // Vérifier d'abord si le produit est utilisé dans des lignes de facture
    const { data: lignesFacture, error: checkError } = await supabase
      .from("lignes_facture")
      .select("id")
      .eq("produit_id", id)
      .limit(1)

    if (checkError) {
      console.error(`Erreur lors de la vérification des références du produit ${id}:`, checkError)
      return { success: false, message: "Erreur lors de la vérification des références du produit." }
    }

    // Si le produit est utilisé dans des factures, empêcher la suppression
    if (lignesFacture && lignesFacture.length > 0) {
      return {
        success: false,
        message:
          "Ce produit ne peut pas être supprimé car il est utilisé dans une ou plusieurs factures. Vous pouvez le désactiver ou le modifier à la place.",
      }
    }

    // Si le produit n'est pas utilisé, procéder à la suppression
    const success = await this.delete(id)

    if (!success) {
      return { success: false, message: "Erreur lors de la suppression du produit." }
    }

    return { success: true }
  }
}

// Exporter une instance singleton du service
export const produitsService = new ProduitsService()

// Exporter les fonctions nommées requises
export const fetchProduits = (includeInactive = false) => produitsService.fetchProduits(includeInactive)
export const fetchProduitById = (id: string) => produitsService.fetchProduitById(id)
export const createProduit = (produit: Omit<Produit, "id" | "dateCreation">) => produitsService.createProduit(produit)
export const updateProduit = (id: string, updates: Partial<Produit>) => produitsService.updateProduit(id, updates)
export const deleteProduit = (id: string) => produitsService.deleteProduit(id)
