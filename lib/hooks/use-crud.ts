"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"

export interface UseCrudOptions<T, ID = string> {
  fetchItems: () => Promise<T[]>
  fetchItemById?: (id: ID) => Promise<T | null>
  createItem?: (data: Partial<T>) => Promise<T>
  updateItem?: (id: ID, data: Partial<T>) => Promise<T | null>
  deleteItem?: (id: ID) => Promise<boolean | { success: boolean; message?: string }>
  onItemsLoaded?: (items: T[]) => void
  onItemCreated?: (item: T) => void
  onItemUpdated?: (item: T) => void
  onItemDeleted?: (id: ID) => void
}

export function useCrud<T extends { id: ID }, ID = string>({
  fetchItems,
  fetchItemById,
  createItem,
  updateItem,
  deleteItem,
  onItemsLoaded,
  onItemCreated,
  onItemUpdated,
  onItemDeleted,
}: UseCrudOptions<T, ID>) {
  const [items, setItems] = useState<T[]>([])
  const [selectedItem, setSelectedItem] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchItems()
      setItems(data)

      if (onItemsLoaded) {
        onItemsLoaded(data)
      }
    } catch (err) {
      console.error("Erreur lors du chargement des éléments:", err)
      setError("Impossible de charger les données.")
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [fetchItems, onItemsLoaded])

  const loadItemById = useCallback(
    async (id: ID) => {
      if (!fetchItemById) return null

      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchItemById(id)
        setSelectedItem(data)
        return data
      } catch (err) {
        console.error(`Erreur lors du chargement de l'élément ${id}:`, err)
        setError(`Impossible de charger l'élément ${id}.`)
        toast({
          title: "Erreur",
          description: `Impossible de charger l'élément ${id}.`,
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [fetchItemById],
  )

  const handleCreate = useCallback(
    async (data: Partial<T>) => {
      if (!createItem) {
        throw new Error("La fonction createItem n'est pas définie")
      }

      try {
        setIsSubmitting(true)
        setError(null)
        const newItem = await createItem(data)

        setItems((prevItems) => [...prevItems, newItem])

        toast({
          title: "Succès",
          description: "L'élément a été créé avec succès.",
        })

        if (onItemCreated) {
          onItemCreated(newItem)
        }

        return newItem
      } catch (err) {
        console.error("Erreur lors de la création de l'élément:", err)
        setError("Impossible de créer l'élément.")
        toast({
          title: "Erreur",
          description: "Impossible de créer l'élément.",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    [createItem, onItemCreated],
  )

  const handleUpdate = useCallback(
    async (id: ID, data: Partial<T>) => {
      if (!updateItem) {
        throw new Error("La fonction updateItem n'est pas définie")
      }

      try {
        setIsSubmitting(true)
        setError(null)
        const updatedItem = await updateItem(id, data)

        if (updatedItem) {
          setItems((prevItems) => prevItems.map((item) => (item.id === id ? updatedItem : item)))

          if (selectedItem?.id === id) {
            setSelectedItem(updatedItem)
          }

          toast({
            title: "Succès",
            description: "L'élément a été mis à jour avec succès.",
          })

          if (onItemUpdated) {
            onItemUpdated(updatedItem)
          }
        }

        return updatedItem
      } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'élément ${id}:`, err)
        setError(`Impossible de mettre à jour l'élément ${id}.`)
        toast({
          title: "Erreur",
          description: `Impossible de mettre à jour l'élément ${id}.`,
          variant: "destructive",
        })
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    [updateItem, selectedItem, onItemUpdated],
  )

  const handleDelete = useCallback(
    async (id: ID) => {
      if (!deleteItem) {
        throw new Error("La fonction deleteItem n'est pas définie")
      }

      try {
        setIsSubmitting(true)
        setError(null)
        const result = await deleteItem(id)

        const success = typeof result === "boolean" ? result : result.success
        const message = typeof result === "boolean" ? undefined : result.message

        if (success) {
          setItems((prevItems) => prevItems.filter((item) => item.id !== id))

          if (selectedItem?.id === id) {
            setSelectedItem(null)
          }

          toast({
            title: "Succès",
            description: "L'élément a été supprimé avec succès.",
          })

          if (onItemDeleted) {
            onItemDeleted(id)
          }

          return true
        } else {
          toast({
            title: "Impossible de supprimer l'élément",
            description: message || "Une erreur est survenue lors de la suppression.",
            variant: "destructive",
          })
          return false
        }
      } catch (err) {
        console.error(`Erreur lors de la suppression de l'élément ${id}:`, err)
        setError(`Impossible de supprimer l'élément ${id}.`)
        toast({
          title: "Erreur",
          description: `Impossible de supprimer l'élément ${id}.`,
          variant: "destructive",
        })
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [deleteItem, selectedItem, onItemDeleted],
  )

  useEffect(() => {
    loadItems()
  }, [loadItems])

  return {
    items,
    selectedItem,
    isLoading,
    isSubmitting,
    error,
    loadItems,
    loadItemById,
    createItem: handleCreate,
    updateItem: handleUpdate,
    deleteItem: handleDelete,
    setSelectedItem,
  }
}
