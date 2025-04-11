"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { toast } from "@/components/ui/use-toast"
import { fetchPaiements, deletePaiementById } from "../actions"
import type { Paiement, PaiementMethode, PaiementStatut } from "../types"

export function PaiementsList() {
  const router = useRouter()
  const [paiements, setPaiements] = useState<Paiement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadPaiements()
  }, [])

  const loadPaiements = async () => {
    try {
      setIsLoading(true)
      const data = await fetchPaiements()
      setPaiements(data)
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

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      try {
        setIsDeleting(true)
        const success = await deletePaiementById(id)
        if (success) {
          setPaiements((prev) => prev.filter((p) => p.id !== id))
          toast({
            title: "Succès",
            description: "Le paiement a été supprimé avec succès.",
          })
        } else {
          throw new Error("Échec de la suppression")
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du paiement:", error)
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le paiement. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
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
      case "echoue":
        return "Échoué"
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
      case "echoue":
        return "destructive"
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
            <CardTitle>Liste des paiements</CardTitle>
            <CardDescription>Consultez et gérez tous vos paiements</CardDescription>
          </div>
          <Button onClick={() => router.push("/paiements/nouveau")}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau paiement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paiements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun paiement enregistré.
                  </TableCell>
                </TableRow>
              ) : (
                paiements.map((paiement) => (
                  <TableRow key={paiement.id}>
                    <TableCell>{formatDate(paiement.datePaiement)}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => router.push(`/factures/${paiement.factureId}`)}
                      >
                        {paiement.factureNumero}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => router.push(`/clients/${paiement.clientId}`)}
                      >
                        {paiement.clientNom}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(paiement.montant)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CreditCard className="mr-1 h-4 w-4" />
                        {getMethodeLabel(paiement.methode)}
                      </div>
                    </TableCell>
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
                            onClick={() => handleDelete(paiement.id)}
                            disabled={isDeleting}
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
      </CardContent>
    </Card>
  )
}
