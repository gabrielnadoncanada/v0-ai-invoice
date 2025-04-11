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
import { ClientForm } from "./client-form"
import { clientsService } from "../api/clients-service"
import type { Client } from "@/lib/types"
import { useState } from "react"

export function ClientsList() {
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    items: clients,
    isLoading,
    createItem,
    deleteItem,
  } = useCrud<Client>({
    fetchItems: () => clientsService.fetchClients(),
    createItem: (data) => clientsService.createClient(data as Omit<Client, "id" | "dateCreation">),
    deleteItem: (id) => clientsService.deleteClient(id),
    onItemCreated: () => setIsAddDialogOpen(false),
  })

  const handleAddClient = async (data: Partial<Client>) => {
    await createItem(data)
  }

  const handleDeleteClient = async () => {
    if (!clientToDelete) return
    await deleteItem(clientToDelete.id)
    setClientToDelete(null)
  }

  const columns = [
    {
      header: "Nom",
      accessorKey: "nom",
      sortable: true,
    },
    {
      header: "Email",
      accessorKey: "email",
      sortable: true,
    },
    {
      header: "Téléphone",
      accessorKey: "telephone",
    },
    {
      header: "Ville",
      accessorKey: "ville",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (client: Client) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/clients/${client.id}`)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setClientToDelete(client)
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
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">Gérez vos clients et leurs informations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un client</DialogTitle>
              <DialogDescription>Remplissez les informations du nouveau client.</DialogDescription>
            </DialogHeader>
            <ClientForm onSubmit={handleAddClient} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={clients}
        columns={columns}
        onRowClick={(client) => router.push(`/clients/${client.id}`)}
        isLoading={isLoading}
        searchable={true}
        searchKeys={["nom", "email", "ville"]}
      />

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`Êtes-vous sûr de vouloir supprimer ce client ?`}
        description={`Cette action est irréversible. Toutes les données associées à "${clientToDelete?.nom}" seront supprimées.`}
        onConfirm={handleDeleteClient}
      />
    </div>
  )
}
