"use server"

import {
  fetchProduits as fetchProduitsService,
  fetchProduitById as fetchProduitByIdService,
  createProduit as createProduitService,
  updateProduit as updateProduitService,
  deleteProduit as deleteProduitService,
} from "./api/produits-service"
import type { Produit } from "@/lib/types"

export async function fetchProduits(includeInactive = false): Promise<Produit[]> {
  return fetchProduitsService(includeInactive)
}

export async function fetchProduitById(id: string): Promise<Produit | null> {
  return fetchProduitByIdService(id)
}

export async function createNewProduit(produit: Omit<Produit, "id" | "dateCreation">): Promise<Produit> {
  return createProduitService(produit)
}

export async function updateProduitData(id: string, updates: Partial<Produit>): Promise<Produit | null> {
  return updateProduitService(id, updates)
}

export async function deleteProduitById(id: string): Promise<{ success: boolean; message?: string }> {
  return deleteProduitService(id)
}
