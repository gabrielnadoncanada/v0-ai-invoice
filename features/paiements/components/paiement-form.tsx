"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { createNewPaiement, updatePaiementData, fetchPaiementById } from "../actions"
import { fetchFactureById } from "@/features/factures/actions"
import type { PaiementFormData, Paiement } from "../types"
import type { Facture } from "@/lib/types"

interface PaiementFormProps {
  paiementId?: string
  factureId?: string
  onSuccess?: (paiement: Paiement) => void
}

export function PaiementForm({ paiementId, factureId: propFactureId, onSuccess }: PaiementFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlFactureId = searchParams.get("factureId")

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [facture, setFacture] = useState<Facture | null>(null)
  const [paiement, setPaiement] = useState<Paiement | null>(null)

  const [formData, setFormData] = useState<PaiementFormData>({
    factureId: propFactureId || urlFactureId || "",
    montant: 0,
    methode: "virement",
    statut: "en_attente",
    datePaiement: new Date(),
  })

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        // Si on a un ID de paiement, on charge le paiement
        if (paiementId) {
          const paiementData = await fetchPaiementById(paiementId)
          if (paiementData) {
            setPaiement(paiementData)
            setFormData({
              factureId: paiementData.factureId,
              montant: paiementData.montant,
              methode: paiementData.methode,
              statut: paiementData.statut,
              reference: paiementData.reference,
              notes: paiementData.notes,
              datePaiement: paiementData.datePaiement,
            })

            // Charger la facture associée
            const factureData = await fetchFactureById(paiementData.factureId)
            if (factureData) {
              setFacture(factureData)
            }
          } else {
            toast({
              title: "Erreur",
              description: "Impossible de charger les informations du paiement.",
              variant: "destructive",
            })
            router.push("/paiements")
          }
        }
        // Sinon, si on a un ID de facture, on charge la facture
        else if (propFactureId || urlFactureId) {
          const factureData = await fetchFactureById(propFactureId || urlFactureId || "")
          if (factureData) {
            setFacture(factureData)
            setFormData((prev) => ({
              ...prev,
              factureId: factureData.id,
              montant: factureData.montantTTC,
            }))
          } else {
            toast({
              title: "Erreur",
              description: "Impossible de charger les informations de la facture.",
              variant: "destructive",
            })
            router.push("/paiements")
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des données.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [paiementId, propFactureId, urlFactureId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "montant" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value ? new Date(value) : new Date(),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (paiementId) {
        // Mise à jour d'un paiement existant
        const updatedPaiement = await updatePaiementData(paiementId, formData)
        if (updatedPaiement) {
          toast({
            title: "Succès",
            description: "Le paiement a été mis à jour avec succès.",
          })
          if (onSuccess) {
            onSuccess(updatedPaiement)
          } else {
            router.push(`/paiements/${updatedPaiement.id}`)
          }
        } else {
          throw new Error("Échec de la mise à jour du paiement")
        }
      } else {
        // Création d'un nouveau paiement
        const newPaiement = await createNewPaiement(formData)
        if (newPaiement) {
          toast({
            title: "Succès",
            description: "Le paiement a été créé avec succès.",
          })
          if (onSuccess) {
            onSuccess(newPaiement)
          } else {
            router.push(`/paiements/${newPaiement.id}`)
          }
        } else {
          throw new Error("Échec de la création du paiement")
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du paiement.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {facture && (
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">Informations de la facture</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Numéro</p>
              <p className="font-medium">{facture.numero}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{facture.clientNom}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Montant TTC</p>
              <p className="font-medium">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(facture.montantTTC)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <p className="font-medium">{facture.statut}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="montant">Montant*</Label>
          <Input
            id="montant"
            name="montant"
            type="number"
            step="0.01"
            min="0"
            value={formData.montant}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="datePaiement">Date de paiement*</Label>
          <Input
            id="datePaiement"
            name="datePaiement"
            type="date"
            value={formData.datePaiement.toISOString().split("T")[0]}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="methode">Méthode de paiement*</Label>
          <Select value={formData.methode} onValueChange={(value) => handleSelectChange("methode", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une méthode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="virement">Virement bancaire</SelectItem>
              <SelectItem value="carte">Carte bancaire</SelectItem>
              <SelectItem value="especes">Espèces</SelectItem>
              <SelectItem value="cheque">Chèque</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="statut">Statut*</Label>
          <Select value={formData.statut} onValueChange={(value) => handleSelectChange("statut", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="complete">Complété</SelectItem>
              <SelectItem value="annule">Annulé</SelectItem>
              <SelectItem value="rembourse">Remboursé</SelectItem>
              <SelectItem value="echoue">Échoué</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reference">Référence</Label>
          <Input id="reference" name="reference" value={formData.reference || ""} onChange={handleChange} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} rows={3} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {paiementId ? "Mise à jour..." : "Création..."}
            </>
          ) : paiementId ? (
            "Mettre à jour"
          ) : (
            "Créer le paiement"
          )}
        </Button>
      </div>
    </form>
  )
}
