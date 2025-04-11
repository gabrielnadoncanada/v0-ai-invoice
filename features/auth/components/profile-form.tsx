"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "../hooks/use-auth"
import { Loader2, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfileForm() {
  const { user, profile, updateProfile, isLoading } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [position, setPosition] = useState("")
  const [company, setCompany] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "")
      setLastName(profile.lastName || "")
      setPhone(profile.phone || "")
      setPosition(profile.position || "")
      setCompany(profile.company || "")
    } else if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
    }
  }, [user, profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
        position,
        company,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement du profil...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profil non disponible</CardTitle>
          <CardDescription>Vous devez être connecté pour accéder à votre profil.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil utilisateur</CardTitle>
        <CardDescription>Gérez vos informations personnelles et vos préférences</CardDescription>
      </CardHeader>
      <Tabs defaultValue="general">
        <TabsList className="mx-6">
          <TabsTrigger value="general">Informations générales</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl || ""} alt={user.fullName || user.email} />
                  <AvatarFallback>
                    {user.firstName && user.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`
                      : user.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Changer l'avatar
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Fonction</Label>
                  <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="security">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Changer de mot de passe</h3>
              <p className="text-sm text-muted-foreground">
                Pour changer votre mot de passe, utilisez le lien de réinitialisation de mot de passe.
              </p>
              <Button variant="outline" asChild>
                <a href="/reset-password">Réinitialiser le mot de passe</a>
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
