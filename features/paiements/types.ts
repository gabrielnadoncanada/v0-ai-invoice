export type PaiementMethode = "carte" | "virement" | "especes" | "cheque" | "autre"
export type PaiementStatut = "en_attente" | "complete" | "annule" | "rembourse" | "echoue"

export interface Paiement {
  id: string
  factureId: string
  factureNumero: string
  clientId: string
  clientNom: string
  montant: number
  methode: PaiementMethode
  statut: PaiementStatut
  reference?: string
  notes?: string
  datePaiement: Date
  dateCreation: Date
}

export interface PaiementFormData {
  factureId: string
  montant: number
  methode: PaiementMethode
  statut: PaiementStatut
  reference?: string
  notes?: string
  datePaiement: Date
}

export interface PaiementFilters {
  clientId?: string
  factureId?: string
  statut?: PaiementStatut
  methode?: PaiementMethode
  dateDebut?: Date
  dateFin?: Date
}
