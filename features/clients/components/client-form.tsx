"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "@/lib/hooks/use-form"
import type { Client } from "@/lib/types"

interface ClientFormProps {
  client?: Client
  isLoading?: boolean
  onSubmit: (data: Partial<Client>) => Promise<void>
}

export function ClientForm({ client, isLoading = false, onSubmit }: ClientFormProps) {
  const router = useRouter()

  const defaultValues: Partial<Client> = client || {
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "France",
  }

  const { formData, isSubmitting, handleChange, handleSubmit } = useForm<Partial<Client>>({
    initialData: defaultValues,
    onSubmit,
    successMessage: client ? "Le client a été mis à jour avec succès" : "Le client a été créé avec succès",
    errorMessage: "Impossible d'enregistrer le client",
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des informations du client...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Informations du client</CardTitle>
          <CardDescription>Renseignez les informations du client</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" value={formData.nom || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" value={formData.telephone || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input id="siret" value={formData.siret || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tva">Numéro de TVA</Label>
              <Input id="tva" value={formData.tva || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium mb-2">Adresse</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" value={formData.adresse || ""} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input id="ville" value={formData.ville || ""} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code postal</Label>
                <Input id="codePostal" value={formData.codePostal || ""} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pays">Pays</Label>
                <Input id="pays" value={formData.pays || ""} onChange={handleChange} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/clients")}>
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
