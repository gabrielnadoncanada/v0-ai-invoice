import type { CommandeIA } from "./types"

export function analyserCommande(texte: string): CommandeIA | null {
  const texteNormalise = texte
    .toLowerCase()
    .trim()
    .replace(/é/g, "e")
    .replace(/è/g, "e")
    .replace(/ê/g, "e")
    .replace(/à/g, "a")
    .replace(/ç/g, "c")

  // Détection de l'action
  let action: CommandeIA["action"] | null = null

  // Patterns pour créer
  const patternsCreer = [
    /cre+[er]+\s+(?:un|une|des)?/,
    /ajout[er]+\s+(?:un|une|des)?/,
    /nouv[eau|elle]+\s+(?:un|une)?/,
    /fait[es]?\s+(?:un|une)?/,
    /je\s+veux\s+(?:un|une)?/,
    /je\s+souhaite\s+(?:un|une)?/,
  ]

  if (patternsCreer.some((pattern) => pattern.test(texteNormalise))) {
    action = "créer"
  } else if (
    texteNormalise.includes("modifi") ||
    texteNormalise.includes("chang") ||
    texteNormalise.includes("met") ||
    texteNormalise.includes("a jour") ||
    texteNormalise.includes("actualise")
  ) {
    action = "modifier"
  } else if (
    texteNormalise.includes("supprim") ||
    texteNormalise.includes("efface") ||
    texteNormalise.includes("enlev") ||
    texteNormalise.includes("retire")
  ) {
    action = "supprimer"
  } else if (
    texteNormalise.includes("list") ||
    texteNormalise.includes("montre") ||
    texteNormalise.includes("affiche tous") ||
    texteNormalise.includes("voir tous") ||
    texteNormalise.includes("tous les")
  ) {
    action = "lister"
  } else if (
    texteNormalise.includes("affiche") ||
    texteNormalise.includes("montre") ||
    texteNormalise.includes("detail") ||
    texteNormalise.includes("voir") ||
    texteNormalise.includes("info")
  ) {
    action = "afficher"
  }

  if (!action) return null

  // Détection de l'entité
  let entite: CommandeIA["entite"] | null = null
  if (texteNormalise.includes("facture")) {
    entite = "facture"
  } else if (texteNormalise.includes("client")) {
    entite = "client"
  } else if (texteNormalise.includes("produit")) {
    entite = "produit"
  }

  // Si l'action est créer et qu'on n'a pas détecté d'entité, essayons de déduire l'entité
  if (action === "créer" && !entite) {
    if (texteNormalise.includes("article") || texteNormalise.includes("service")) {
      entite = "produit"
    } else if (
      texteNormalise.includes("entreprise") ||
      texteNormalise.includes("societe") ||
      texteNormalise.includes("personne")
    ) {
      entite = "client"
    } else if (texteNormalise.includes("devis") || texteNormalise.includes("document")) {
      entite = "facture"
    }
  }

  if (!entite) return null

  // Extraction de l'ID si présent
  let id: string | undefined
  const idMatch =
    texteNormalise.match(/(?:numéro|id|identifiant|n°)\s*(\d+)/i) || texteNormalise.match(/(\d+)(?:\s*$|\s+[a-z])/i)
  if (idMatch) {
    id = idMatch[1]
  }

  // Extraction des données pour création/modification
  const donnees: any = {}

  // Pour les clients
  if (entite === "client") {
    const nomMatch =
      texte.match(/nom\s*(?:est|:)?\s*["']?([^"']+)["']?/i) ||
      texte.match(/["']([^"']+)["']\s+(?:comme nom|en tant que nom)/i)
    if (nomMatch) donnees.nom = nomMatch[1].trim()

    const emailMatch =
      texte.match(/email\s*(?:est|:)?\s*["']?([^"'\s]+@[^"'\s]+\.[^"'\s]+)["']?/i) ||
      texte.match(/["']?([^"'\s]+@[^"'\s]+\.[^"'\s]+)["']?\s+(?:comme email|en tant qu'email)/i)
    if (emailMatch) donnees.email = emailMatch[1].trim()

    const telMatch = texte.match(/(?:téléphone|tel)\s*(?:est|:)?\s*["']?([0-9\s+\-.]+)["']?/i)
    if (telMatch) donnees.telephone = telMatch[1].trim()

    const adresseMatch = texte.match(/adresse\s*(?:est|:)?\s*["']?([^"']+)["']?/i)
    if (adresseMatch) donnees.adresse = adresseMatch[1].trim()
  }

  // Pour les produits
  if (entite === "produit") {
    const nomMatch =
      texte.match(/nom\s*(?:est|:)?\s*["']?([^"']+)["']?/i) ||
      texte.match(/["']([^"']+)["']\s+(?:comme nom|en tant que nom)/i)
    if (nomMatch) donnees.nom = nomMatch[1].trim()

    const descriptionMatch = texte.match(/description\s*(?:est|:)?\s*["']?([^"']+)["']?/i)
    if (descriptionMatch) donnees.description = descriptionMatch[1].trim()

    const prixMatch = texte.match(/prix\s*(?:est|:)?\s*["']?(\d+(?:[.,]\d+)?)["']?/i)
    if (prixMatch) donnees.prix = Number.parseFloat(prixMatch[1].replace(",", "."))

    const tvaMatch = texte.match(/tva\s*(?:est|:)?\s*["']?(\d+(?:[.,]\d+)?)["']?/i)
    if (tvaMatch) donnees.tva = Number.parseFloat(tvaMatch[1].replace(",", "."))
  }

  // Pour les factures
  if (entite === "facture") {
    const clientIdMatch = texte.match(/client\s*(?:id|numéro)?\s*(?:est|:)?\s*["']?(\d+)["']?/i)
    if (clientIdMatch) donnees.clientId = clientIdMatch[1].trim()

    const clientNomMatch = texte.match(/client\s*(?:nom)?\s*(?:est|:)?\s*["']?([^"']+)["']?/i)
    if (clientNomMatch) donnees.clientNom = clientNomMatch[1].trim()

    const statutMatch = texte.match(/statut\s*(?:est|:)?\s*["']?([^"']+)["']?/i)
    if (statutMatch) {
      const statut = statutMatch[1].trim().toLowerCase()
      if (["brouillon", "envoyée", "payée", "annulée"].includes(statut)) {
        donnees.statut = statut
      }
    }
  }

  // Extraction des filtres pour lister
  const filtres: any = {}
  if (action === "lister") {
    if (entite === "facture") {
      if (texteNormalise.includes("payée") || texteNormalise.includes("payées")) {
        filtres.statut = "payée"
      } else if (texteNormalise.includes("envoyée") || texteNormalise.includes("envoyées")) {
        filtres.statut = "envoyée"
      } else if (texteNormalise.includes("brouillon") || texteNormalise.includes("brouillons")) {
        filtres.statut = "brouillon"
      } else if (texteNormalise.includes("annulée") || texteNormalise.includes("annulées")) {
        filtres.statut = "annulée"
      }
    }
  }

  return {
    action,
    entite,
    id,
    donnees: Object.keys(donnees).length > 0 ? donnees : undefined,
    filtres: Object.keys(filtres).length > 0 ? filtres : undefined,
  }
}
