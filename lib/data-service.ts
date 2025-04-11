import { createServerSupabaseClient } from "./supabase"
import type { Client, Facture, Produit, LigneFacture } from "./types"

// Fonctions pour les clients
export async function getClients(): Promise<Client[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("clients").select("*").order("nom")

  if (error) {
    console.error("Erreur lors de la récupération des clients:", error)
    return []
  }

  return data.map((client) => ({
    id: client.id,
    nom: client.nom,
    email: client.email,
    telephone: client.telephone || undefined,
    adresse: client.adresse || undefined,
    ville: client.ville || undefined,
    codePostal: client.code_postal || undefined,
    pays: client.pays || undefined,
    siret: client.siret || undefined,
    tva: client.tva || undefined,
    dateCreation: new Date(client.date_creation),
  }))
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error(`Erreur lors de la récupération du client ${id}:`, error)
    return null
  }

  return {
    id: data.id,
    nom: data.nom,
    email: data.email,
    telephone: data.telephone || undefined,
    adresse: data.adresse || undefined,
    ville: data.ville || undefined,
    codePostal: data.code_postal || undefined,
    pays: data.pays || undefined,
    siret: data.siret || undefined,
    tva: data.tva || undefined,
    dateCreation: new Date(data.date_creation),
  }
}

export async function createClient(client: Omit<Client, "id" | "dateCreation">): Promise<Client> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("clients")
    .insert({
      nom: client.nom,
      email: client.email,
      telephone: client.telephone || null,
      adresse: client.adresse || null,
      ville: client.ville || null,
      code_postal: client.codePostal || null,
      pays: client.pays || null,
      siret: client.siret || null,
      tva: client.tva || null,
    })
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création du client:", error)
    throw new Error(`Erreur lors de la création du client: ${error.message}`)
  }

  return {
    id: data.id,
    nom: data.nom,
    email: data.email,
    telephone: data.telephone || undefined,
    adresse: data.adresse || undefined,
    ville: data.ville || undefined,
    codePostal: data.code_postal || undefined,
    pays: data.pays || undefined,
    siret: data.siret || undefined,
    tva: data.tva || undefined,
    dateCreation: new Date(data.date_creation),
  }
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
  const supabase = createServerSupabaseClient()

  // Convertir les champs du modèle Client vers la structure de la base de données
  const dbUpdates: any = {}
  if (updates.nom !== undefined) dbUpdates.nom = updates.nom
  if (updates.email !== undefined) dbUpdates.email = updates.email
  if (updates.telephone !== undefined) dbUpdates.telephone = updates.telephone
  if (updates.adresse !== undefined) dbUpdates.adresse = updates.adresse
  if (updates.ville !== undefined) dbUpdates.ville = updates.ville
  if (updates.codePostal !== undefined) dbUpdates.code_postal = updates.codePostal
  if (updates.pays !== undefined) dbUpdates.pays = updates.pays
  if (updates.siret !== undefined) dbUpdates.siret = updates.siret
  if (updates.tva !== undefined) dbUpdates.tva = updates.tva

  const { data, error } = await supabase.from("clients").update(dbUpdates).eq("id", id).select().single()

  if (error) {
    console.error(`Erreur lors de la mise à jour du client ${id}:`, error)
    return null
  }

  return {
    id: data.id,
    nom: data.nom,
    email: data.email,
    telephone: data.telephone || undefined,
    adresse: data.adresse || undefined,
    ville: data.ville || undefined,
    codePostal: data.code_postal || undefined,
    pays: data.pays || undefined,
    siret: data.siret || undefined,
    tva: data.tva || undefined,
    dateCreation: new Date(data.date_creation),
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("clients").delete().eq("id", id)

  if (error) {
    console.error(`Erreur lors de la suppression du client ${id}:`, error)
    return false
  }

  return true
}

// Fonctions pour les produits
// Dans la fonction getProduits, modifier la requête pour filtrer les produits actifs par défaut:
export async function getProduits(includeInactive = false): Promise<Produit[]> {
  const supabase = createServerSupabaseClient()
  let query = supabase.from("produits").select("*")

  if (!includeInactive) {
    query = query.is("actif", null).or("actif.eq.true")
  }

  const { data, error } = await query.order("nom")

  if (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return []
  }

  return data.map((produit) => ({
    id: produit.id,
    nom: produit.nom,
    description: produit.description || undefined,
    prix: produit.prix,
    tva: produit.tva,
    unite: produit.unite || undefined,
    reference: produit.reference || undefined,
    dateCreation: new Date(produit.date_creation),
    actif: produit.actif === false ? false : true,
  }))
}

export async function getProduitById(id: string): Promise<Produit | null> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("produits").select("*").eq("id", id).single()

  if (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error)
    return null
  }

  return {
    id: data.id,
    nom: data.nom,
    description: data.description || undefined,
    prix: data.prix,
    tva: data.tva,
    unite: data.unite || undefined,
    reference: data.reference || undefined,
    dateCreation: new Date(data.date_creation),
  }
}

// Dans la fonction createProduit, ajouter le champ actif:
export async function createProduit(produit: Omit<Produit, "id" | "dateCreation">): Promise<Produit> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("produits")
    .insert({
      nom: produit.nom,
      description: produit.description || null,
      prix: produit.prix,
      tva: produit.tva,
      unite: produit.unite || null,
      reference: produit.reference || null,
      actif: produit.actif === false ? false : true,
    })
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création du produit:", error)
    throw new Error(`Erreur lors de la création du produit: ${error.message}`)
  }

  return {
    id: data.id,
    nom: data.nom,
    description: data.description || undefined,
    prix: data.prix,
    tva: data.tva,
    unite: data.unite || undefined,
    reference: data.reference || undefined,
    dateCreation: new Date(data.date_creation),
    actif: data.actif === false ? false : true,
  }
}

// Dans la fonction updateProduit, ajouter le champ actif:
export async function updateProduit(id: string, updates: Partial<Produit>): Promise<Produit | null> {
  const supabase = createServerSupabaseClient()

  // Convertir les champs du modèle Produit vers la structure de la base de données
  const dbUpdates: any = {}
  if (updates.nom !== undefined) dbUpdates.nom = updates.nom
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.prix !== undefined) dbUpdates.prix = updates.prix
  if (updates.tva !== undefined) dbUpdates.tva = updates.tva
  if (updates.unite !== undefined) dbUpdates.unite = updates.unite
  if (updates.reference !== undefined) dbUpdates.reference = updates.reference
  if (updates.actif !== undefined) dbUpdates.actif = updates.actif

  const { data, error } = await supabase.from("produits").update(dbUpdates).eq("id", id).select().single()

  if (error) {
    console.error(`Erreur lors de la mise à jour du produit ${id}:`, error)
    return null
  }

  return {
    id: data.id,
    nom: data.nom,
    description: data.description || undefined,
    prix: data.prix,
    tva: data.tva,
    unite: data.unite || undefined,
    reference: data.reference || undefined,
    dateCreation: new Date(data.date_creation),
    actif: data.actif === false ? false : true,
  }
}

export async function deleteProduit(id: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("produits").delete().eq("id", id)

  if (error) {
    console.error(`Erreur lors de la suppression du produit ${id}:`, error)
    return false
  }

  return true
}

// Fonctions pour les factures
export async function getFactures(): Promise<Facture[]> {
  const supabase = createServerSupabaseClient()
  const { data: facturesData, error: facturesError } = await supabase
    .from("factures")
    .select("*")
    .order("date_emission", { ascending: false })

  if (facturesError) {
    console.error("Erreur lors de la récupération des factures:", facturesError)
    return []
  }

  // Récupérer toutes les lignes de facture
  const { data: lignesData, error: lignesError } = await supabase.from("lignes_facture").select("*")

  if (lignesError) {
    console.error("Erreur lors de la récupération des lignes de facture:", lignesError)
    return []
  }

  // Organiser les lignes par facture_id
  const lignesParFacture: Record<string, LigneFacture[]> = {}
  lignesData.forEach((ligne) => {
    if (!lignesParFacture[ligne.facture_id]) {
      lignesParFacture[ligne.facture_id] = []
    }

    lignesParFacture[ligne.facture_id].push({
      id: ligne.id,
      produitId: ligne.produit_id,
      produitNom: ligne.produit_nom,
      quantite: ligne.quantite,
      prixUnitaire: ligne.prix_unitaire,
      tva: ligne.tva,
      remise: ligne.remise || undefined,
      montantHT: ligne.montant_ht,
      montantTTC: ligne.montant_ttc,
    })
  })

  // Construire les objets Facture avec leurs lignes
  return facturesData.map((facture) => ({
    id: facture.id,
    numero: facture.numero,
    clientId: facture.client_id,
    clientNom: facture.client_nom,
    dateEmission: new Date(facture.date_emission),
    dateEcheance: new Date(facture.date_echeance),
    lignes: lignesParFacture[facture.id] || [],
    montantHT: facture.montant_ht,
    montantTTC: facture.montant_ttc,
    statut: facture.statut,
    notes: facture.notes || undefined,
    conditionsPaiement: facture.conditions_paiement || undefined,
  }))
}

export async function getFactureById(id: string): Promise<Facture | null> {
  const supabase = createServerSupabaseClient()

  // Récupérer la facture
  const { data: facture, error: factureError } = await supabase.from("factures").select("*").eq("id", id).single()

  if (factureError) {
    console.error(`Erreur lors de la récupération de la facture ${id}:`, factureError)
    return null
  }

  // Récupérer les lignes de la facture
  const { data: lignes, error: lignesError } = await supabase.from("lignes_facture").select("*").eq("facture_id", id)

  if (lignesError) {
    console.error(`Erreur lors de la récupération des lignes de la facture ${id}:`, lignesError)
    return null
  }

  // Construire l'objet Facture avec ses lignes
  return {
    id: facture.id,
    numero: facture.numero,
    clientId: facture.client_id,
    clientNom: facture.client_nom,
    dateEmission: new Date(facture.date_emission),
    dateEcheance: new Date(facture.date_echeance),
    lignes: lignes.map((ligne) => ({
      id: ligne.id,
      produitId: ligne.produit_id,
      produitNom: ligne.produit_nom,
      quantite: ligne.quantite,
      prixUnitaire: ligne.prix_unitaire,
      tva: ligne.tva,
      remise: ligne.remise || undefined,
      montantHT: ligne.montant_ht,
      montantTTC: ligne.montant_ttc,
    })),
    montantHT: facture.montant_ht,
    montantTTC: facture.montant_ttc,
    statut: facture.statut,
    notes: facture.notes || undefined,
    conditionsPaiement: facture.conditions_paiement || undefined,
  }
}

export async function createFacture(factureData: Omit<Facture, "id">): Promise<Facture> {
  const supabase = createServerSupabaseClient()

  // Insérer la facture
  const { data: facture, error: factureError } = await supabase
    .from("factures")
    .insert({
      numero: factureData.numero,
      client_id: factureData.clientId,
      client_nom: factureData.clientNom,
      date_emission: factureData.dateEmission.toISOString(),
      date_echeance: factureData.dateEcheance.toISOString(),
      montant_ht: factureData.montantHT,
      montant_ttc: factureData.montantTTC,
      statut: factureData.statut,
      notes: factureData.notes || null,
      conditions_paiement: factureData.conditionsPaiement || null,
    })
    .select()
    .single()

  if (factureError) {
    console.error("Erreur lors de la création de la facture:", factureError)
    throw new Error(`Erreur lors de la création de la facture: ${factureError.message}`)
  }

  // Si la facture a des lignes, les insérer
  if (factureData.lignes && factureData.lignes.length > 0) {
    const lignesInsert = factureData.lignes.map((ligne) => ({
      facture_id: facture.id,
      produit_id: ligne.produitId,
      produit_nom: ligne.produitNom,
      quantite: ligne.quantite,
      prix_unitaire: ligne.prixUnitaire,
      tva: ligne.tva,
      remise: ligne.remise || null,
      montant_ht: ligne.montantHT,
      montant_ttc: ligne.montantTTC,
    }))

    const { data: lignes, error: lignesError } = await supabase.from("lignes_facture").insert(lignesInsert).select()

    if (lignesError) {
      console.error("Erreur lors de la création des lignes de facture:", lignesError)
      // On ne lance pas d'erreur ici pour ne pas bloquer la création de la facture
    }
  }

  // Retourner la facture créée
  return {
    id: facture.id,
    numero: facture.numero,
    clientId: facture.client_id,
    clientNom: facture.client_nom,
    dateEmission: new Date(facture.date_emission),
    dateEcheance: new Date(facture.date_echeance),
    lignes: factureData.lignes || [],
    montantHT: facture.montant_ht,
    montantTTC: facture.montant_ttc,
    statut: facture.statut,
    notes: facture.notes || undefined,
    conditionsPaiement: facture.conditions_paiement || undefined,
  }
}

export async function updateFacture(id: string, updates: Partial<Facture>): Promise<Facture | null> {
  const supabase = createServerSupabaseClient()

  // Récupérer la facture existante
  const existingFacture = await getFactureById(id)
  if (!existingFacture) {
    return null
  }

  // Préparer les mises à jour pour la facture
  const factureUpdates: any = {}
  if (updates.numero !== undefined) factureUpdates.numero = updates.numero
  if (updates.clientId !== undefined) factureUpdates.client_id = updates.clientId
  if (updates.clientNom !== undefined) factureUpdates.client_nom = updates.clientNom
  if (updates.dateEmission !== undefined) factureUpdates.date_emission = updates.dateEmission.toISOString()
  if (updates.dateEcheance !== undefined) factureUpdates.date_echeance = updates.dateEcheance.toISOString()
  if (updates.montantHT !== undefined) factureUpdates.montant_ht = updates.montantHT
  if (updates.montantTTC !== undefined) factureUpdates.montant_ttc = updates.montantTTC
  if (updates.statut !== undefined) factureUpdates.statut = updates.statut
  if (updates.notes !== undefined) factureUpdates.notes = updates.notes
  if (updates.conditionsPaiement !== undefined) factureUpdates.conditions_paiement = updates.conditionsPaiement

  // Mettre à jour la facture
  if (Object.keys(factureUpdates).length > 0) {
    const { error: updateError } = await supabase.from("factures").update(factureUpdates).eq("id", id)

    if (updateError) {
      console.error(`Erreur lors de la mise à jour de la facture ${id}:`, updateError)
      return null
    }
  }

  // Si les lignes sont mises à jour
  if (updates.lignes !== undefined) {
    // Supprimer les lignes existantes
    const { error: deleteError } = await supabase.from("lignes_facture").delete().eq("facture_id", id)

    if (deleteError) {
      console.error(`Erreur lors de la suppression des lignes de la facture ${id}:`, deleteError)
      return null
    }

    // Insérer les nouvelles lignes
    if (updates.lignes.length > 0) {
      const lignesInsert = updates.lignes.map((ligne) => ({
        facture_id: id,
        produit_id: ligne.produitId,
        produit_nom: ligne.produitNom,
        quantite: ligne.quantite,
        prix_unitaire: ligne.prixUnitaire,
        tva: ligne.tva,
        remise: ligne.remise || null,
        montant_ht: ligne.montantHT,
        montant_ttc: ligne.montantTTC,
      }))

      const { error: insertError } = await supabase.from("lignes_facture").insert(lignesInsert)

      if (insertError) {
        console.error(`Erreur lors de l'insertion des nouvelles lignes de la facture ${id}:`, insertError)
        return null
      }
    }
  }

  // Récupérer la facture mise à jour
  return getFactureById(id)
}
