"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { resetPassword } from "../actions"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function ResetPasswordForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await resetPassword({ email })

      if (error) {
        toast({
          title: "Erreur",
          description: error,
          variant: "destructive",
        })
        return
      }

      setIsSuccess(true)
      toast({
        title: "Email envoyé",
        description: "Un email de réinitialisation de mot de passe a été envoyé à votre adresse email.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email envoyé</CardTitle>
          <CardDescription>Un email de réinitialisation de mot de passe a été envoyé à {email}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe.
          </p>
          <p className="text-sm text-muted-foreground">
            Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier de spam.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={() => router.push("/login")} className="w-full">
            Retour à la connexion
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Réinitialiser le mot de passe</CardTitle>
        <CardDescription>
          Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...
              </>
            ) : (
              "Envoyer le lien de réinitialisation"
            )}
          </Button>
          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Retour à la connexion
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
