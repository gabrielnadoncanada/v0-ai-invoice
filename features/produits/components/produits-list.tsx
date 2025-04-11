"use client"

import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { useCrud } from "@/lib/hooks/use-crud"
import { ProduitForm } from "./produit-form"
import { produitsService } from "../api/produits-service"
import type { Produit } from "@/lib/types"
import { useState } from "react"

export function ProduitsList() {
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [produitToDelete, setProduitToDelete] = useState<Produit | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    items: produits,
    isLoading,
    createItem,
    deleteItem,
  } = useCrud<Produit>({
    fetchItems: () => produitsService.fetchProduits(),
    createItem: (data) => produitsService.createProduit(data as Omit<Produit, "id" | "dateCreation">),
    deleteItem: (id) => produitsService.deleteProduit(id),
    onItemCreated: () => setIsAddDialogOpen(false),
  })

  const handleAddProduit = async (data: Partial<Produit>) => {
    await createItem(data)
  }

  const handleDeleteProduit = async () => {
    if (!produitToDelete) return
    await deleteItem(produitToDelete.id)
    setProduitToDelete(null)
  }

  const columns = [
    {
      header: "Nom",
      accessorKey: "nom",
      sortable: true,
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Prix",
      accessorKey: "prix",
      cell: (produit: Produit) => `${produit.prix.toFixed(2)} €`,
      sortable: true,
    },
    {
      header: "TVA",
      accessorKey: "tva",
      cell: (produit: Produit) => `${produit.tva} %`,
    },
    {
      header: "Référence",
      accessorKey: "reference",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (produit: Produit) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/produits/${produit.id}`)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setProduitToDelete(produit)
              setIsDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produits</h2>
          <p className="text-muted-foreground">Gérez vos produits et services</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau produit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un produit</DialogTitle>
              <DialogDescription>Remplissez les informations du nouveau produit.</DialogDescription>
            </DialogHeader>
            <ProduitForm onSubmit={handleAddProduit} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={produits}
        columns={columns}
        onRowClick={(produit) => router.push(`/produits/${produit.id}`)}
        isLoading={isLoading}
        searchable={true}
        searchKeys={["nom", "description", "reference"]}
      />

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`Êtes-vous sûr de vouloir supprimer ce produit ?`}
        description={`Cette action est irréversible. Toutes les données associées à "${produitToDelete?.nom}" seront supprimées.`}
        onConfirm={handleDeleteProduit}
      />
    </div>
  )
}
