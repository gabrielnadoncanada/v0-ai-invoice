"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Plus, Trash2, FileText, Send, CreditCard, Loader2 } from "lucide-react"
import { fetchFactureById, updateFactureData, fetchClients, fetchProduits, fetchClientById } from "@/lib/actions"
import type { Facture, Client, Produit, LigneFacture } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { FacturePaiements } from "@/features/paiements/components/facture-paiements"

export default function FactureDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [facture, setFacture] = useState<Facture | null>(null)
  const [formData, setFormData] = useState<Partial<Facture>>({})
  const [clients, setClients] = useState<Client[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddLigneDialogOpen, setIsAddLigneDialogOpen] = useState(false)
  const [newLigne, setNewLigne] = useState({
    produitId: "",
    quantite: 1,
    remise: 0,
  })
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [factureData, clientsData, produitsData] = await Promise.all([
          fetchFactureById(params.id),
          fetchClients(),
          fetchProduits(),
        ])

        if (factureData) {
          setFacture(factureData)
          setFormData(factureData)
        } else {
          toast({
            title: "Facture introuvable",
            description: "La facture demandée n'existe pas ou a été supprimée.",
            variant: "destructive",
          })
          router.push("/factures")
        }

        setClients(clientsData || [])
        setProduits(produitsData || [])
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de la facture. Veuillez réessayer.",
          variant: "destructive",
        })
        router.push("/factures")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleClientChange = async (clientId: string) => {
    try {
      const client = await fetchClientById(clientId)
      if (client) {
        setFormData((prev) => ({
          ...prev,
          clientId,
          clientNom: client.nom,
        }))
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du client:", error)
    }
  }

  const handleStatusChange = (statut: string) => {
    setFormData((prev) => ({
      ...prev,
      statut: statut as "brouillon" | "envoyée" | "payée" | "annulée",
    }))
  }

  const handleAddLigne = async () => {
    if (!facture || !newLigne.produitId || newLigne.quantite <= 0) return

    const produit = produits.find((p) => p.id === newLigne.produitId)
    if (!produit) return

    const prixUnitaire = produit.prix
    const montantHT = prixUnitaire * newLigne.quantite * (1 - newLigne.remise / 100)
    const montantTTC = montantHT * (1 + produit.tva / 100)

    const newLigneFacture: LigneFacture = {
      id: Date.now().toString(),
      produitId: produit.id,
      produitNom: produit.nom,
      quantite: newLigne.quantite,
      prixUnitaire,
      tva: produit.tva,
      remise: newLigne.remise,
      montantHT,
      montantTTC,
    }

    const updatedLignes = [...(facture.lignes || []), newLigneFacture]

    // Recalculer les totaux
    const newMontantHT = updatedLignes.reduce((sum, ligne) => sum + ligne.montantHT, 0)
    const newMontantTTC = updatedLignes.reduce((sum, ligne) => sum + ligne.montantTTC, 0)

    try {
      const updatedFacture = await updateFactureData(facture.id, {
        lignes: updatedLignes,
        montantHT: newMontantHT,
        montantTTC: newMontantTTC,
      })

      if (updatedFacture) {
        setFacture(updatedFacture)
        setFormData(updatedFacture)
        toast({
          title: "Ligne ajoutée",
          description: "La ligne a été ajoutée à la facture avec succès.",
        })
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la ligne:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la ligne à la facture. Veuillez réessayer.",
        variant: "destructive",
      })
    }

    setIsAddLigneDialogOpen(false)
    setNewLigne({
      produitId: "",
      quantite: 1,
      remise: 0,
    })
  }

  const handleDeleteLigne = async (ligneId: string) => {
    if (!facture) return

    const updatedLignes = facture.lignes.filter((ligne) => ligne.id !== ligneId)

    // Recalculer les totaux
    const newMontantHT = updatedLignes.reduce((sum, ligne) => sum + ligne.montantHT, 0)
    const newMontantTTC = updatedLignes.reduce((sum, ligne) => sum + ligne.montantTTC, 0)

    try {
      const updatedFacture = await updateFactureData(facture.id, {
        lignes: updatedLignes,
        montantHT: newMontantHT,
        montantTTC: newMontantTTC,
      })

      if (updatedFacture) {
        setFacture(updatedFacture)
        setFormData(updatedFacture)
        toast({
          title: "Ligne supprimée",
          description: "La ligne a été supprimée de la facture avec succès.",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la ligne:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la ligne de la facture. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!facture) return

    try {
      setIsSubmitting(true)
      const updatedFacture = await updateFactureData(facture.id, formData)
      if (updatedFacture) {
        setFacture(updatedFacture)
        setFormData(updatedFacture)
        toast({
          title: "Facture mise à jour",
          description: "Les informations de la facture ont été mises à jour avec succès.",
        })
      } else {
        throw new Error("Échec de la mise à jour")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la facture:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de la facture. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleAddPaiement = () => {
    router.push(`/paiements/nouveau?factureId=${params.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des informations de la facture...</span>
      </div>
    )
  }

  if (!facture) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Facture introuvable</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/factures")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{facture.numero}</h2>
            <p className="text-muted-foreground">
              Client: {facture.clientNom} | Statut: {facture.statut}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Aperçu
          </Button>
          <Button variant="outline">
            <Send className="mr-2 h-4 w-4" />
            Envoyer
          </Button>
          <Button onClick={handleAddPaiement}>
            <CreditCard className="mr-2 h-4 w-4" />
            Ajouter un paiement
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="lignes">Lignes de facture</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informations de la facture</CardTitle>
                <CardDescription>Modifiez les informations de la facture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Numéro de facture</Label>
                    <Input id="numero" value={formData.numero || ""} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client</Label>
                    <Select value={formData.clientId} onValueChange={handleClientChange}>
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
                  <div className="space-y-2">
                    <Label htmlFor="dateEmission">Date d'émission</Label>
                    <Input
                      id="dateEmission"
                      type="date"
                      value={formData.dateEmission ? new Date(formData.dateEmission).toISOString().split("T")[0] : ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateEcheance">Date d'échéance</Label>
                    <Input
                      id="dateEcheance"
                      type="date"
                      value={formData.dateEcheance ? new Date(formData.dateEcheance).toISOString().split("T")[0] : ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statut">Statut</Label>
                    <Select value={formData.statut} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brouillon">Brouillon</SelectItem>
                        <SelectItem value="envoyée">Envoyée</SelectItem>
                        <SelectItem value="payée">Payée</SelectItem>
                        <SelectItem value="annulée">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conditionsPaiement">Conditions de paiement</Label>
                    <Input id="conditionsPaiement" value={formData.conditionsPaiement || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" value={formData.notes || ""} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.push("/factures")}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Enregistrer
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="lignes" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Lignes de facture</CardTitle>
                  <CardDescription>Gérez les produits et services de cette facture</CardDescription>
                </div>
                <Dialog open={isAddLigneDialogOpen} onOpenChange={setIsAddLigneDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter une ligne
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Ajouter une ligne</DialogTitle>
                      <DialogDescription>Sélectionnez un produit et sa quantité.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="produitId" className="text-right">
                          Produit*
                        </Label>
                        <div className="col-span-3">
                          <Select
                            value={newLigne.produitId}
                            onValueChange={(value) => setNewLigne({ ...newLigne, produitId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un produit" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.isArray(produits) && produits.length > 0 ? (
                                produits.map((produit) => (
                                  <SelectItem key={produit.id} value={produit.id}>
                                    {produit.nom} - {produit.prix.toFixed(2)}€
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                  Aucun produit disponible
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantite" className="text-right">
                          Quantité*
                        </Label>
                        <Input
                          id="quantite"
                          type="number"
                          min="1"
                          value={newLigne.quantite}
                          onChange={(e) => setNewLigne({ ...newLigne, quantite: Number.parseInt(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="remise" className="text-right">
                          Remise (%)
                        </Label>
                        <Input
                          id="remise"
                          type="number"
                          min="0"
                          max="100"
                          value={newLigne.remise}
                          onChange={(e) => setNewLigne({ ...newLigne, remise: Number.parseInt(e.target.value) })}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddLigneDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleAddLigne} disabled={!newLigne.produitId || newLigne.quantite <= 0}>
                        Ajouter
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead className="text-right">Prix unitaire</TableHead>
                    <TableHead className="text-right">TVA</TableHead>
                    <TableHead className="text-right">Remise</TableHead>
                    <TableHead className="text-right">Total HT</TableHead>
                    <TableHead className="text-right">Total TTC</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facture.lignes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        Aucune ligne de facture. Cliquez sur "Ajouter une ligne" pour commencer.
                      </TableCell>
                    </TableRow>
                  ) : (
                    facture.lignes.map((ligne) => (
                      <TableRow key={ligne.id}>
                        <TableCell>{ligne.produitNom}</TableCell>
                        <TableCell className="text-right">{ligne.quantite}</TableCell>
                        <TableCell className="text-right">{ligne.prixUnitaire.toFixed(2)} €</TableCell>
                        <TableCell className="text-right">{ligne.tva} %</TableCell>
                        <TableCell className="text-right">{ligne.remise || 0} %</TableCell>
                        <TableCell className="text-right">{ligne.montantHT.toFixed(2)} €</TableCell>
                        <TableCell className="text-right">{ligne.montantTTC.toFixed(2)} €</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteLigne(ligne.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col items-end gap-2 border-t p-4">
              <div className="flex justify-between w-full md:w-1/3 text-sm">
                <span>Total HT:</span>
                <span className="font-medium">{facture.montantHT.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between w-full md:w-1/3 text-sm">
                <span>TVA:</span>
                <span className="font-medium">{(facture.montantTTC - facture.montantHT).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between w-full md:w-1/3 text-base font-bold">
                <span>Total TTC:</span>
                <span>{facture.montantTTC.toFixed(2)} €</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="paiements" className="space-y-4 pt-4">
          <FacturePaiements factureId={facture.id} facture={facture} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
