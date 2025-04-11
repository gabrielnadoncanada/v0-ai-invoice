export type Client = {
  id: string
  nom: string
  email: string
  telephone?: string
  adresse?: string
  ville?: string
  codePostal?: string
  pays?: string
  siret?: string
  tva?: string
  dateCreation: Date
}

export type Produit = {
  id: string
  nom: string
  description?: string
  prix: number
  tva: number
  unite?: string
  reference?: string
  dateCreation: Date
  actif?: boolean
}

export type LigneFacture = {
  id: string
  produitId: string
  produitNom: string
  quantite: number
  prixUnitaire: number
  tva: number
  remise?: number
  montantHT: number
  montantTTC: number
}

export type Facture = {
  id: string
  numero: string
  clientId: string
  clientNom: string
  dateEmission: Date
  dateEcheance: Date
  lignes: LigneFacture[]
  montantHT: number
  montantTTC: number
  statut: "brouillon" | "envoyée" | "payée" | "annulée"
  notes?: string
  conditionsPaiement?: string
}

export type CommandeIA = {
  action: "créer" | "modifier" | "supprimer" | "lister" | "afficher"
  entite: "facture" | "client" | "produit"
  id?: string
  donnees?: any
  filtres?: any
}
