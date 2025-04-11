"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, CreditCard, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { usePaiement } from "../hooks/use-paiement"
import type { Paiement, PaiementMethode, PaiementStatut } from "../types"
import Link from "next/link"

interface PaiementDetailProps {
  paiement: Paiement
}

export function PaiementDetail({ paiement }: PaiementDetailProps) {
  const router = useRouter()
  const { deletePaiement, isSubmitting } = usePaiement()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    const success = await deletePaiement(paiement.id, "/paiements")
    if (success) {
      setIsDeleteDialogOpen(false)
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Détails du paiement</CardTitle>
              <CardDescription>
                Paiement du {formatDate(paiement.datePaiement)} - {formatCurrency(paiement.montant)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Facture</h3>
                <Link
                  href={`/factures/${paiement.factureId}`}
                  className="flex items-center mt-1 text-blue-600 hover:underline"
                >
                  <FileText className="mr-1 h-4 w-4" />
                  {paiement.factureNumero}
                </Link>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                <p className="mt-1">{paiement.clientNom}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Montant</h3>
                <p className="mt-1 text-lg font-semibold">{formatCurrency(paiement.montant)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Méthode de paiement</h3>
                <div className="flex items-center mt-1">
                  <CreditCard className="mr-1 h-4 w-4" />
                  {getMethodeLabel(paiement.methode)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Statut</h3>
                <div className="mt-1">
                  <Badge variant={getStatutVariant(paiement.statut)}>{getStatutLabel(paiement.statut)}</Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Référence</h3>
                <p className="mt-1">{paiement.reference || "-"}</p>
              </div>
            </div>
          </div>

          {paiement.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p className="mt-1 whitespace-pre-line">{paiement.notes}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Informations supplémentaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Date de paiement</p>
                <p>{formatDate(paiement.datePaiement)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p>{formatDate(paiement.dateCreation)}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/paiements")}>
            Retour à la liste
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/paiements/${paiement.id}/modifier`)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </CardFooter>
      </Card>

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
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
