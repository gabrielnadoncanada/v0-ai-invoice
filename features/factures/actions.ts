"use server"

import {
  fetchFactures as fetchFacturesService,
  fetchFactureById as fetchFactureByIdService,
  createFacture as createFactureService,
  updateFacture as updateFactureService,
  deleteFacture as deleteFactureService,
} from "./api/factures-service"
import type { Facture } from "@/lib/types"

export async function fetchFactures(): Promise<Facture[]> {
  return fetchFacturesService()
}

export async function fetchFactureById(id: string): Promise<Facture | null> {
  return fetchFactureByIdService(id)
}

export async function createNewFacture(factureData: Omit<Facture, "id">): Promise<Facture> {
  return createFactureService(factureData)
}

export async function updateFactureData(id: string, updates: Partial<Facture>): Promise<Facture | null> {
  return updateFactureService(id, updates)
}

export async function deleteFactureById(id: string): Promise<boolean> {
  return deleteFactureService(id)
}
