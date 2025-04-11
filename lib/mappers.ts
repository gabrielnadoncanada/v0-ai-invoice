import type { Database } from "./database.types"
import type { Client, Produit, BusinessSettings } from "./types"

// Mappers pour convertir les données de la DB vers les modèles d'application
export function mapDbClientToClient(dbClient: Database["public"]["Tables"]["clients"]["Row"]): Client {
  return {
    id: dbClient.id,
    nom: dbClient.nom,
    email: dbClient.email,
    telephone: dbClient.telephone || undefined,
    adresse: dbClient.adresse || undefined,
    ville: dbClient.ville || undefined,
    codePostal: dbClient.code_postal || undefined,
    pays: dbClient.pays || undefined,
    siret: dbClient.siret || undefined,
    tva: dbClient.tva || undefined,
    dateCreation: new Date(dbClient.date_creation),
  }
}

export function mapClientToDbClient(
  client: Partial<Client>,
): Partial<Database["public"]["Tables"]["clients"]["Insert"]> {
  const dbClient: Partial<Database["public"]["Tables"]["clients"]["Insert"]> = {}

  if (client.id !== undefined) dbClient.id = client.id
  if (client.nom !== undefined) dbClient.nom = client.nom
  if (client.email !== undefined) dbClient.email = client.email
  if (client.telephone !== undefined) dbClient.telephone = client.telephone || null
  if (client.adresse !== undefined) dbClient.adresse = client.adresse || null
  if (client.ville !== undefined) dbClient.ville = client.ville || null
  if (client.codePostal !== undefined) dbClient.code_postal = client.codePostal || null
  if (client.pays !== undefined) dbClient.pays = client.pays || null
  if (client.siret !== undefined) dbClient.siret = client.siret || null
  if (client.tva !== undefined) dbClient.tva = client.tva || null

  return dbClient
}

export function mapDbProduitToProduit(dbProduit: Database["public"]["Tables"]["produits"]["Row"]): Produit {
  return {
    id: dbProduit.id,
    nom: dbProduit.nom,
    description: dbProduit.description || undefined,
    prix: dbProduit.prix,
    tva: dbProduit.tva,
    unite: dbProduit.unite || undefined,
    reference: dbProduit.reference || undefined,
    dateCreation: new Date(dbProduit.date_creation),
    actif: dbProduit.actif === false ? false : true,
  }
}

export function mapProduitToDbProduit(
  produit: Partial<Produit>,
): Partial<Database["public"]["Tables"]["produits"]["Insert"]> {
  const dbProduit: Partial<Database["public"]["Tables"]["produits"]["Insert"]> = {}

  if (produit.id !== undefined) dbProduit.id = produit.id
  if (produit.nom !== undefined) dbProduit.nom = produit.nom
  if (produit.description !== undefined) dbProduit.description = produit.description || null
  if (produit.prix !== undefined) dbProduit.prix = produit.prix
  if (produit.tva !== undefined) dbProduit.tva = produit.tva
  if (produit.unite !== undefined) dbProduit.unite = produit.unite || null
  if (produit.reference !== undefined) dbProduit.reference = produit.reference || null
  if (produit.actif !== undefined) dbProduit.actif = produit.actif

  return dbProduit
}

export function mapDbBusinessSettingsToBusinessSettings(
  dbSettings: Database["public"]["Tables"]["business_settings"]["Row"],
): BusinessSettings {
  return {
    id: dbSettings.id,
    name: dbSettings.name,
    logo: dbSettings.logo || undefined,
    address: dbSettings.address || undefined,
    city: dbSettings.city || undefined,
    postalCode: dbSettings.postal_code || undefined,
    country: dbSettings.country || undefined,
    phone: dbSettings.phone || undefined,
    email: dbSettings.email || undefined,
    website: dbSettings.website || undefined,
    siret: dbSettings.siret || undefined,
    tvaNumber: dbSettings.tva_number || undefined,
    defaultTvaRate: dbSettings.default_tva_rate,
    invoicePrefix: dbSettings.invoice_prefix,
    invoiceNextNumber: dbSettings.invoice_next_number,
    primaryColor: dbSettings.primary_color || undefined,
    secondaryColor: dbSettings.secondary_color || undefined,
    termsAndConditions: dbSettings.terms_and_conditions || undefined,
    bankDetails: dbSettings.bank_details || undefined,
    createdAt: new Date(dbSettings.created_at),
    updatedAt: new Date(dbSettings.updated_at),
  }
}

export function mapBusinessSettingsToDbBusinessSettings(
  settings: Partial<BusinessSettings>,
): Partial<Database["public"]["Tables"]["business_settings"]["Insert"]> {
  const dbSettings: Partial<Database["public"]["Tables"]["business_settings"]["Insert"]> = {}

  if (settings.id !== undefined) dbSettings.id = settings.id
  if (settings.name !== undefined) dbSettings.name = settings.name
  if (settings.logo !== undefined) dbSettings.logo = settings.logo || null
  if (settings.address !== undefined) dbSettings.address = settings.address || null
  if (settings.city !== undefined) dbSettings.city = settings.city || null
  if (settings.postalCode !== undefined) dbSettings.postal_code = settings.postalCode || null
  if (settings.country !== undefined) dbSettings.country = settings.country || null
  if (settings.phone !== undefined) dbSettings.phone = settings.phone || null
  if (settings.email !== undefined) dbSettings.email = settings.email || null
  if (settings.website !== undefined) dbSettings.website = settings.website || null
  if (settings.siret !== undefined) dbSettings.siret = settings.siret || null
  if (settings.tvaNumber !== undefined) dbSettings.tva_number = settings.tvaNumber || null
  if (settings.defaultTvaRate !== undefined) dbSettings.default_tva_rate = settings.defaultTvaRate
  if (settings.invoicePrefix !== undefined) dbSettings.invoice_prefix = settings.invoicePrefix
  if (settings.invoiceNextNumber !== undefined) dbSettings.invoice_next_number = settings.invoiceNextNumber
  if (settings.primaryColor !== undefined) dbSettings.primary_color = settings.primaryColor || null
  if (settings.secondaryColor !== undefined) dbSettings.secondary_color = settings.secondaryColor || null
  if (settings.termsAndConditions !== undefined) dbSettings.terms_and_conditions = settings.termsAndConditions || null
  if (settings.bankDetails !== undefined) dbSettings.bank_details = settings.bankDetails || null

  return dbSettings
}
