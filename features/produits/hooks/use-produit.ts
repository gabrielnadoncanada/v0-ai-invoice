"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { fetchProduitById, updateProduitData, createNewProduit } from "@/lib/actions"
import type { Produit } from "@/lib/types"

export function useProduit(id?: string) {
  const [produit, setProduit] = useState<Produit | null>(null)
  const [isLoading, setIsLoading] = useState(id ? true : false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      loadProduit(id)
    }
  }, [id])

  const loadProduit = async (produitId: string) => {
    try {
      setIsLoading(true)
      const data = await fetchProduitById(produitId)
      setProduit(data)
    } catch (error) {
      console.error("Erreur lors du chargement du produit:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations du produit.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveProduit = async (data: Partial<Produit>) => {
    try {
      setIsSubmitting(true)

      if (id && produit) {
        // Mise à jour d'un produit existant
        const updatedProduit = await updateProduitData(id, data)
        if (updatedProduit) {
          setProduit(updatedProduit)
          toast({
            title: "Succès",
            description: "Le produit a été mis à jour avec succès.",
          })
          return updatedProduit
        }
      } else {
        // Création d'un nouveau produit
        const newProduit = await createNewProduit(data as Omit<Produit, "id" | "dateCreation">)
        toast({
          title: "Succès",
          description: "Le produit a été créé avec succès.",
        })
        return newProduit
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du produit:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le produit.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    produit,
    isLoading,
    isSubmitting,
    saveProduit,
  }
}
