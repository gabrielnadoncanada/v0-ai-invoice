"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, MoreHorizontal, Trash2, Edit, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { usePaiement } from "../hooks/use-paiement"
import { fetchPaiementsByFactureId } from "../actions"
import type { Paiement, PaiementMethode, PaiementStatut } from "../types"
import type { Facture } from "@/lib/types"

interface FacturePaiementsProps {
  factureId: string
  facture: Facture
}

export function FacturePaiements({ factureId, facture }: FacturePaiementsProps) {
  const router = useRouter()
  const { deletePaiement, isSubmitting } = usePaiement()
  const [paiements, setPaiements] = useState<Paiement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [paiementToDelete, setPaiementToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [totalPaye, setTotalPaye] = useState(0)
  const [resteAPayer, setResteAPayer] = useState(0)

  useEffect(() => {
    async function loadPaiements() {
      try {
        setIsLoading(true)
        const data = await fetchPaiementsByFactureId(factureId)
        setPaiements(data)

        // Calculer le total payé et le reste à payer
        const total = data.reduce((sum, p) => {
          return p.statut === "complete" ? sum + p.montant : sum
        }, 0)
        setTotalPaye(total)
        setResteAPayer(Math.max(0, facture.montantTTC - total))
      } catch (error) {
        console.error("Erreur lors du chargement des paiements:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les paiements. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPaiements()
  }, [factureId, facture.montantTTC])

  const handleAddPaiement = () => {
    router.push(`/paiements/nouveau?factureId=${factureId}`)
  }

  const handleDeleteClick = (id: string) => {
    setPaiementToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (paiementToDelete) {
      const success = await deletePaiement(paiementToDelete)
      if (success) {
        setPaiements(paiements.filter((p) => p.id !== paiementToDelete))

        // Recalculer le total payé et le reste à payer
        const updatedPaiements = paiements.filter((p) => p.id !== paiementToDelete)
        const total = updatedPaiements.reduce((sum, p) => {
          return p.statut === "complete" ? sum + p.montant : sum
        }, 0)
        setTotalPaye(total)
        setResteAPayer(Math.max(0, facture.montantTTC - total))

        setIsDeleteDialogOpen(false)
        setPaiementToDelete(null)
      }
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getStatutLabel = (statut: PaiementStatut) => {
    switch (statut) {
      case "en_attente":
        return "En attente"
      case "complete":
        return "Complété"
      case "annule":
        return "Annulé"
      case "rembourse":
        return "Remboursé"
      default:
        return statut
    }
  }

  const getStatutVariant = (statut: PaiementStatut): "default" | "outline" | "secondary" | "destructive" => {
    switch (statut) {
      case "en_attente":
        return "secondary"
      case "complete":
        return "default"
      case "annule":
        return "destructive"
      case "rembourse":
        return "outline"
      default:
        return "default"
    }
  }

  const getMethodeLabel = (methode: PaiementMethode) => {
    switch (methode) {
      case "carte":
        return "Carte bancaire"
      case "virement":
        return "Virement bancaire"
      case "especes":
        return "Espèces"
      case "cheque":
        return "Chèque"
      case "autre":
        return "Autre"
      default:
        return methode
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des paiements...</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Paiements</CardTitle>
            <CardDescription>Gérez les paiements de cette facture</CardDescription>
          </div>
          <Button onClick={handleAddPaiement}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un paiement
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paiements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun paiement enregistré pour cette facture.
                  </TableCell>
                </TableRow>
              ) : (
                paiements.map((paiement) => (
                  <TableRow key={paiement.id}>
                    <TableCell>{formatDate(paiement.datePaiement)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(paiement.montant)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CreditCard className="mr-1 h-4 w-4" />
                        {getMethodeLabel(paiement.methode)}
                      </div>
                    </TableCell>
                    <TableCell>{paiement.reference || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatutVariant(paiement.statut)}>{getStatutLabel(paiement.statut)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/paiements/${paiement.id}`)}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/paiements/${paiement.id}/modifier`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(paiement.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col items-end gap-2 border-t p-4">
          <div className="flex justify-between w-full md:w-1/3 text-sm">
            <span>Total facture:</span>
            <span className="font-medium">{formatCurrency(facture.montantTTC)}</span>
          </div>
          <div className="flex justify-between w-full md:w-1/3 text-sm">
            <span>Total payé:</span>
            <span className="font-medium">{formatCurrency(totalPaye)}</span>
          </div>
          <div className="flex justify-between w-full md:w-1/3 text-base font-bold">
            <span>Reste à payer:</span>
            <span>{formatCurrency(resteAPayer)}</span>
          </div>
        </div>
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
