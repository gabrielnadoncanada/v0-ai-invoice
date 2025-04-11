"use server"

import {
  fetchClients as fetchClientsService,
  fetchClientById as fetchClientByIdService,
  createClient as createClientService,
  updateClient as updateClientService,
  deleteClient as deleteClientService,
} from "./api/clients-service"
import type { Client } from "@/lib/types"

export async function fetchClients(): Promise<Client[]> {
  return fetchClientsService()
}

export async function fetchClientById(id: string): Promise<Client | null> {
  return fetchClientByIdService(id)
}

export async function createNewClient(client: Omit<Client, "id" | "dateCreation">): Promise<Client> {
  return createClientService(client)
}

export async function updateClientData(id: string, updates: Partial<Client>): Promise<Client | null> {
  return updateClientService(id, updates)
}

export async function deleteClientById(id: string): Promise<{ success: boolean; message?: string }> {
  return deleteClientService(id)
}
