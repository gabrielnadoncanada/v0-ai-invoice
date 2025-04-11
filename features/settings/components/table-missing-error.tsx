"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Database } from "lucide-react"
import { useState } from "react"

interface TableMissingErrorProps {
  onRetry: () => void
}

export function TableMissingError({ onRetry }: TableMissingErrorProps) {
  const [isCopied, setIsCopied] = useState(false)

  const sqlScript = `
-- Créer l'extension uuid-ossp si elle n'existe pas déjà
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Créer la table business_settings
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  address TEXT,
  city VARCHAR(255),
  postal_code VARCHAR(20),
  country VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  siret VARCHAR(20),
  tva_number VARCHAR(20),
  default_tva_rate NUMERIC(5,2) NOT NULL DEFAULT 20.0,
  invoice_prefix VARCHAR(20) NOT NULL DEFAULT 'FACT-',
  invoice_next_number INTEGER NOT NULL DEFAULT 1,
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  terms_and_conditions TEXT,
  bank_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insérer un enregistrement par défaut s'il n'y en a pas déjà
INSERT INTO business_settings (name, default_tva_rate, invoice_prefix, invoice_next_number)
SELECT 'Mon Entreprise', 20, 'FACT-', 1
WHERE NOT EXISTS (SELECT 1 FROM business_settings LIMIT 1);
  `.trim()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-destructive" />
          <CardTitle>Table manquante</CardTitle>
        </div>
        <CardDescription>
          La table "business_settings" n'existe pas dans la base de données. Vous devez la créer manuellement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Pour créer la table, exécutez le script SQL suivant dans l'interface SQL de Supabase :
        </p>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">{sqlScript}</pre>
          <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
            {isCopied ? "Copié !" : "Copier"}
          </Button>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <AlertCircle className="h-4 w-4" />
            <span>Important</span>
          </div>
          <p>
            La création de tables nécessite des privilèges d'administrateur et ne peut pas être effectuée
            automatiquement via l'API. Vous devez exécuter ce script manuellement dans l'interface SQL de Supabase.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onRetry} className="w-full">
          Réessayer après avoir créé la table
        </Button>
      </CardFooter>
    </Card>
  )
}
