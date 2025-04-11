import { BaseService } from "@/lib/base-service"
import { mapDbClientToClient, mapClientToDbClient } from "@/lib/mappers"
import type { Client } from "@/lib/types"
import { createServerSupabaseClient } from "@/lib/supabase"

export class ClientsService extends BaseService<"clients"> {
  constructor() {
    super("clients")
  }

  async fetchClients(): Promise<Client[]> {
    try {
      const data = await this.findAll({ orderBy: "nom" })
      return data.map(mapDbClientToClient)
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error)
      return []
    }
  }

  async fetchClientById(id: string): Promise<Client | null> {
    try {
      const data = await this.findById(id)
      if (!data) return null
      return mapDbClientToClient(data)
    } catch (error) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error)
      return null
    }
  }

  async createClient(client: Omit<Client, "id" | "dateCreation">): Promise<Client> {
    const dbClient = mapClientToDbClient(client)
    const data = await this.create(dbClient)
    return mapDbClientToClient(data)
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    const dbUpdates = mapClientToDbClient(updates)
    const data = await this.update(id, dbUpdates)
    if (!data) return null
    return mapDbClientToClient(data)
  }

  async deleteClient(id: string): Promise<{ success: boolean; message?: string }> {
    const supabase = createServerSupabaseClient()

    // Vérifier d'abord si le client a des factures associées
    const { data: factures, error: checkError } = await supabase
      .from("factures")
      .select("id")
      .eq("client_id", id)
      .limit(1)

    if (checkError) {
      console.error(`Erreur lors de la vérification des factures du client ${id}:`, checkError)
      return {
        success: false,
        message: "Erreur lors de la vérification des factures associées au client.",
      }
    }

    // Si le client a des factures, empêcher la suppression
    if (factures && factures.length > 0) {
      return {
        success: false,
        message:
          "Ce client ne peut pas être supprimé car il a des factures associées. Vous devez d'abord supprimer ou réassigner ces factures.",
      }
    }

    // Si le client n'a pas de factures, procéder à la suppression
    const success = await this.delete(id)

    if (!success) {
      return {
        success: false,
        message: "Erreur lors de la suppression du client.",
      }
    }

    return { success: true }
  }
}

// Exporter une instance singleton du service
export const clientsService = new ClientsService()

// Exporter les fonctions nommées requises
export const fetchClients = () => clientsService.fetchClients()
export const fetchClientById = (id: string) => clientsService.fetchClientById(id)
export const createClient = (client: Omit<Client, "id" | "dateCreation">) => clientsService.createClient(client)
export const updateClient = (id: string, updates: Partial<Client>) => clientsService.updateClient(id, updates)
export const deleteClient = (id: string) => clientsService.deleteClient(id)
