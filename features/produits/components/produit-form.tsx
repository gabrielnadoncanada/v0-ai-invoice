"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useForm } from "@/lib/hooks/use-form"
import type { Produit } from "@/lib/types"

interface ProduitFormProps {
  produit?: Produit
  isLoading?: boolean
  onSubmit: (data: Partial<Produit>) => Promise<void>
}

export function ProduitForm({ produit, isLoading = false, onSubmit }: ProduitFormProps) {
  const router = useRouter()

  const defaultValues: Partial<Produit> = produit || {
    nom: "",
    description: "",
    prix: 0,
    tva: 20,
    unite: "unité",
    reference: "",
  }

  const { formData, isSubmitting, handleChange, handleCheckboxChange, handleSubmit } = useForm<Partial<Produit>>({
    initialData: defaultValues,
    onSubmit,
    successMessage: produit ? "Le produit a été mis à jour avec succès" : "Le produit a été créé avec succès",
    errorMessage: "Impossible d'enregistrer le produit",
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des informations du produit...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Informations du produit</CardTitle>
          <CardDescription>Renseignez les informations du produit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={formData.nom || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Référence</Label>
              <Input id="reference" value={formData.reference || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix">Prix (€)</Label>
              <Input
                id="prix"
                type="number"
                min="0"
                step="0.01"
                value={formData.prix || 0}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tva">TVA (%)</Label>
              <Input
                id="tva"
                type="number"
                min="0"
                max="100"
                value={formData.tva || 0}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unite">Unité</Label>
              <Input id="unite" value={formData.unite || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formData.description || ""} onChange={handleChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between mt-4">
          <Button variant="outline" type="button" onClick={() => router.push("/produits")}>
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
  )
}
