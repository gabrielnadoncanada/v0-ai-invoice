"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { updatePassword } from "../actions"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface UpdatePasswordFormProps {
  token: string
}

export function UpdatePasswordForm({ token }: UpdatePasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas")
      return false
    }

    if (password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères")
      return false
    }

    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePassword()) {
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await updatePassword({ password, token })

      if (error) {
        toast({
          title: "Erreur",
          description: error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      })

      router.push("/login")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Définir un nouveau mot de passe</CardTitle>
        <CardDescription>Créez un nouveau mot de passe pour votre compte</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mise à jour...
              </>
            ) : (
              "Mettre à jour le mot de passe"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
