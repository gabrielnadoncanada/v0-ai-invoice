"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { UpdatePasswordForm } from "@/features/auth/components/update-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ResetPasswordConfirmPage() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Récupérer le token depuis les paramètres d'URL
    const tokenParam = searchParams.get("token")

    if (tokenParam) {
      setToken(tokenParam)
    }

    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-2">Chargement...</span>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 w-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Lien invalide</CardTitle>
            <CardDescription>Le lien de réinitialisation de mot de passe est invalide ou a expiré.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Veuillez demander un nouveau lien de réinitialisation de mot de passe.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 rounded-md bg-primary p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary-foreground"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Invoxia AI</h1>
        <p className="text-sm text-muted-foreground">Facturation intelligente avec IA générative</p>
      </div>
      <UpdatePasswordForm token={token} />
    </div>
  )
}
