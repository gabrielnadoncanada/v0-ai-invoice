"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchFactures, fetchClients, createNewFacture, deleteFactureById } from "@/lib/actions"
import type { Facture, Client } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

export default function FacturesPage() {
  const router = useRouter()
  const [factures, setFactures] = useState<Facture[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newFacture, setNewFacture] = useState({
    clientId: "",
    dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],
    conditionsPaiement: "Paiement à 30 jours",
    notes: "",
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [factureToDelete, setFactureToDelete] = useState<Facture | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Charger les factures et les clients
    async function loadData() {
      try {
        setIsLoading(true)
        const [facturesData, clientsData] = await Promise.all([fetchFactures(), fetchClients()])
        setFactures(facturesData)
        setClients(clientsData || []) // Assurez-vous que clients est toujours un tableau
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données. Veuillez réessayer.",
          variant: "destructive",
        })
        // Initialiser avec des tableaux vides en cas d'erreur
        setFactures([])
        setClients([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddFacture = async () => {
    if (!newFacture.clientId) return

    try {
      setIsSubmitting(true)
      const client = clients.find((c) => c.id === newFacture.clientId)
      if (!client) {
        throw new Error("Client introuvable")
      }

      const factureData: Omit<Facture, "id"> = {
        numero: `FACT-${new Date().getFullYear()}-${(factures.length + 1).toString().padStart(3, "0")}`,
        clientId: newFacture.clientId,
        clientNom: client.nom,
        dateEmission: new Date(),
        dateEcheance: new Date(newFacture.dateEcheance),
        lignes: [],
        montantHT: 0,
        montantTTC: 0,
        statut: "brouillon",
        notes: newFacture.notes,
        conditionsPaiement: newFacture.conditionsPaiement,
      }

      const createdFacture = await createNewFacture(factureData)
      setFactures((prev) => [...prev, createdFacture])
      setIsAddDialogOpen(false)
      router.push(`/factures/${createdFacture.id}`)
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer la facture. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteFacture = async () => {
    if (!factureToDelete) return

    try {
      setIsDeleting(true)
      const success = await deleteFactureById(factureToDelete.id)
      if (success) {
        setFactures((prev) => prev.filter((facture) => facture.id !== factureToDelete.id))
        toast({
          title: "Facture supprimée",
          description: `La facture ${factureToDelete.numero} a été supprimée avec succès.`,
        })
      } else {
        throw new Error("Échec de la suppression")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la facture. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setFactureToDelete(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "brouillon":
        return "bg-yellow-100 text-yellow-800"
      case "envoyée":
        return "bg-blue-100 text-blue-800"
      case "payée":
        return "bg-green-100 text-green-800"
      case "annulée":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const columns = [
    {
      header: "Numéro",
      accessorKey: "numero",
    },
    {
      header: "Client",
      accessorKey: "clientNom",
    },
    {
      header: "Date d'émission",
      accessorKey: "dateEmission",
      cell: (facture: Facture) => formatDate(facture.dateEmission),
    },
    {
      header: "Date d'échéance",
      accessorKey: "dateEcheance",
      cell: (facture: Facture) => formatDate(facture.dateEcheance),
    },
    {
      header: "Montant TTC",
      accessorKey: "montantTTC",
      cell: (facture: Facture) => `${facture.montantTTC.toFixed(2)} €`,
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (facture: Facture) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(facture.statut)}`}>
          {facture.statut.charAt(0).toUpperCase() + facture.statut.slice(1)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (facture: Facture) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/factures/${facture.id}`)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog open={deleteDialogOpen && factureToDelete?.id === facture.id} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setFactureToDelete(facture)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette facture ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Toutes les données associées à cette facture seront supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setFactureToDelete(null)}>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteFacture} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Suppression...
                    </>
                  ) : (
                    "Supprimer"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (

        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des factures...</span>
        </div>

    )
  }

  return (

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Factures</h2>
            <p className="text-muted-foreground">Gérez vos factures et suivez leur statut</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle facture
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer une facture</DialogTitle>
                <DialogDescription>Remplissez les informations de base pour créer une facture.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clientId" className="text-right">
                    Client*
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newFacture.clientId}
                      onValueChange={(value) => setNewFacture({ ...newFacture, clientId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un client" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(clients) && clients.length > 0 ? (
                          clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.nom}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">Aucun client disponible</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateEcheance" className="text-right">
                    Date d'échéance
                  </Label>
                  <Input
                    id="dateEcheance"
                    type="date"
                    value={newFacture.dateEcheance}
                    onChange={(e) => setNewFacture({ ...newFacture, dateEcheance: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="conditionsPaiement" className="text-right">
                    Conditions
                  </Label>
                  <Input
                    id="conditionsPaiement"
                    value={newFacture.conditionsPaiement}
                    onChange={(e) => setNewFacture({ ...newFacture, conditionsPaiement: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Input
                    id="notes"
                    value={newFacture.notes}
                    onChange={(e) => setNewFacture({ ...newFacture, notes: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddFacture} disabled={!newFacture.clientId || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création...
                    </>
                  ) : (
                    "Créer et éditer"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable data={factures} columns={columns} onRowClick={(facture) => router.push(`/factures/${facture.id}`)} />
      </div>

  )
}
