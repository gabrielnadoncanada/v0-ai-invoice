"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2, Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { BusinessSettings, BusinessSettingsFormData } from "../types"

interface BusinessSettingsFormProps {
  settings?: BusinessSettings | null
  isLoading?: boolean
  onSubmit: (data: Partial<BusinessSettings>) => Promise<void>
}

export function BusinessSettingsForm({ settings, isLoading = false, onSubmit }: BusinessSettingsFormProps) {
  const [formData, setFormData] = useState<BusinessSettingsFormData>({
    name: "",
    defaultTvaRate: 20,
    invoicePrefix: "FACT-",
    invoiceNextNumber: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name,
        logo: settings.logo,
        address: settings.address,
        city: settings.city,
        postalCode: settings.postalCode,
        country: settings.country,
        phone: settings.phone,
        email: settings.email,
        website: settings.website,
        siret: settings.siret,
        tvaNumber: settings.tvaNumber,
        defaultTvaRate: settings.defaultTvaRate,
        invoicePrefix: settings.invoicePrefix,
        invoiceNextNumber: settings.invoiceNextNumber,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        termsAndConditions: settings.termsAndConditions,
        bankDetails: settings.bankDetails,
      })
    }
  }, [settings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      await onSubmit(formData)
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du formulaire.",
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
        <span className="ml-2">Chargement des paramètres...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="invoicing">Facturation</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="legal">Mentions légales</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Informations de base de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'entreprise</Label>
                  <Input id="name" value={formData.name || ""} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input id="logo" value={formData.logo || ""} onChange={handleChange} placeholder="URL du logo" />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email || ""} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" value={formData.phone || ""} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input id="website" value={formData.website || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Adresse</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" value={formData.address || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" value={formData.city || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input id="postalCode" value={formData.postalCode || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input id="country" value={formData.country || ""} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoicing">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de facturation</CardTitle>
              <CardDescription>Configurez les paramètres de vos factures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Préfixe des factures</Label>
                  <Input id="invoicePrefix" value={formData.invoicePrefix || ""} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceNextNumber">Prochain numéro de facture</Label>
                  <Input
                    id="invoiceNextNumber"
                    type="number"
                    min="1"
                    value={formData.invoiceNextNumber || 1}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultTvaRate">Taux de TVA par défaut (%)</Label>
                  <Input
                    id="defaultTvaRate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.defaultTvaRate || 20}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">Numéro SIRET</Label>
                  <Input id="siret" value={formData.siret || ""} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tvaNumber">Numéro de TVA</Label>
                  <Input id="tvaNumber" value={formData.tvaNumber || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankDetails">Coordonnées bancaires</Label>
                <Textarea
                  id="bankDetails"
                  value={formData.bankDetails || ""}
                  onChange={handleChange}
                  placeholder="IBAN, BIC, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>Personnalisez l'apparence de vos documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      value={formData.primaryColor || ""}
                      onChange={handleChange}
                      placeholder="#3B82F6"
                    />
                    <Input
                      type="color"
                      value={formData.primaryColor || "#3B82F6"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 p-1 h-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      value={formData.secondaryColor || ""}
                      onChange={handleChange}
                      placeholder="#1E3A8A"
                    />
                    <Input
                      type="color"
                      value={formData.secondaryColor || "#1E3A8A"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-12 p-1 h-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Mentions légales</CardTitle>
              <CardDescription>Configurez les mentions légales de vos documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Conditions générales de vente</Label>
                <Textarea
                  id="termsAndConditions"
                  value={formData.termsAndConditions || ""}
                  onChange={handleChange}
                  placeholder="Conditions générales de vente et mentions légales..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Enregistrer les paramètres
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
