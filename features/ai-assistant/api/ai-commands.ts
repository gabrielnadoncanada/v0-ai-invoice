import type { AICommandResult } from "../types"
import { fetchClients, fetchFactures, fetchProduits } from "@/lib/actions"

// Fonction pour analyser la commande et déterminer l'action à effectuer
export async function executeAICommand(command: string): Promise<AICommandResult> {
  // Version simplifiée pour l'exemple
  const commandLower = command.toLowerCase()

  try {
    // Commandes liées aux factures
    if (commandLower.includes("facture") && commandLower.includes("impayée")) {
      const factures = (await fetchFactures()) || []
      const unpaidInvoices = factures.filter((f) => f && f.statut !== "payée")

      if (unpaidInvoices.length === 0) {
        return {
          success: true,
          message: "Vous n'avez aucune facture impayée. Toutes vos factures ont été réglées.",
        }
      }

      return {
        success: true,
        message: `Vous avez ${unpaidInvoices.length} facture(s) impayée(s):\n\n${unpaidInvoices
          .map(
            (f) =>
              `- Facture ${f.numero} pour ${f.client_nom}: ${
                typeof f.montant_ttc === "number" ? f.montant_ttc.toFixed(2) : "0.00"
              }€ (émise le ${new Date(f.date_emission).toLocaleDateString()})`,
          )
          .join("\n")}`,
        data: unpaidInvoices,
      }
    }

    // Commandes liées aux clients
    if (commandLower.includes("client") && (commandLower.includes("liste") || commandLower.includes("tous"))) {
      const clients = (await fetchClients()) || []

      if (clients.length === 0) {
        return {
          success: true,
          message: "Vous n'avez pas encore de clients enregistrés.",
        }
      }

      return {
        success: true,
        message: `Voici la liste de vos clients:\n\n${clients.map((c) => `- ${c.nom} (${c.email})`).join("\n")}`,
        data: clients,
      }
    }

    // Commandes liées aux produits
    if (commandLower.includes("produit") && (commandLower.includes("liste") || commandLower.includes("tous"))) {
      const produits = (await fetchProduits()) || []

      if (produits.length === 0) {
        return {
          success: true,
          message: "Vous n'avez pas encore de produits enregistrés.",
        }
      }

      return {
        success: true,
        message: `Voici la liste de vos produits:\n\n${produits
          .map(
            (p) => `- ${p.nom}: ${typeof p.prix === "number" ? p.prix.toFixed(2) : "0.00"}€ HT (TVA: ${p.tva || 0}%)`,
          )
          .join("\n")}`,
        data: produits,
      }
    }

    // Réponse par défaut si aucune commande n'est reconnue
    return {
      success: true,
      message:
        "Je ne suis pas sûr de comprendre votre demande. Pourriez-vous reformuler ou être plus précis ? Vous pouvez me demander des informations sur vos factures, clients ou produits.",
    }
  } catch (error) {
    console.error("Erreur lors de l'exécution de la commande:", error)
    return {
      success: false,
      message: "Désolé, j'ai rencontré une erreur lors du traitement de votre demande. Veuillez réessayer.",
    }
  }
}
