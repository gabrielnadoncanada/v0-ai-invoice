"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

interface SettingsErrorProps {
  message: string
  onRetry: () => void
}

export function SettingsError({ message, onRetry }: SettingsErrorProps) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle>Erreur</CardTitle>
        </div>
        <CardDescription>Un problème est survenu lors du chargement des paramètres</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onRetry} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </CardFooter>
    </Card>
  )
}
