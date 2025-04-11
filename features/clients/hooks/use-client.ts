"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { fetchClientById, updateClientData } from "@/features/clients/actions"
import type { Client } from "@/lib/types"

export function useClient(id?: string) {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(id ? true : false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      loadClient(id)
    }
  }, [id])

  const loadClient = async (clientId: string) => {
    try {
      setIsLoading(true)
      const data = await fetchClientById(clientId)
      setClient(data)
    } catch (error) {
      console.error("Erreur lors du chargement du client:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations du client.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveClient = async (data: Partial<Client>) => {
    try {
      setIsSubmitting(true)

      if (id && client) {
        // Mise à jour d'un client existant
        const updatedClient = await updateClientData(id, data)
        if (updatedClient) {
          setClient(updatedClient)
          toast({
            title: "Succès",
            description: "Le client a été mis à jour avec succès.",
          })
          return updatedClient
        }
      } else {
        // Cette fonction ne gère pas la création de nouveaux clients
        // Utilisez createNewClient directement pour cela
        throw new Error("ID de client non fourni pour la mise à jour")
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du client:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le client.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    client,
    isLoading,
    isSubmitting,
    saveClient,
  }
}
