import { createServerSupabaseClient } from "@/lib/supabase"

export async function checkBusinessSettingsTable(): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  try {
    // Vérifier si la table existe déjà
    const { error: checkError } = await supabase.from("business_settings").select("id").limit(1)

    // Si la table existe (pas d'erreur ou erreur différente de "relation does not exist"), retourner true
    if (!checkError || !checkError.message.includes("relation") || !checkError.message.includes("does not exist")) {
      return true
    }

    return false
  } catch (error) {
    console.error("Erreur lors de la vérification de la table business_settings:", error)
    return false
  }
}

export async function createDefaultSettings(): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  try {
    // Vérifier d'abord si la table existe
    const tableExists = await checkBusinessSettingsTable()
    if (!tableExists) {
      console.error("La table business_settings n'existe pas et ne peut pas être créée automatiquement")
      return false
    }

    // Vérifier si des paramètres existent déjà
    const { data, error: checkError } = await supabase.from("business_settings").select("id").limit(1)

    if (!checkError && data && data.length > 0) {
      // Des paramètres existent déjà
      return true
    }

    // Insérer un enregistrement par défaut
    const { error: insertError } = await supabase.from("business_settings").insert({
      name: "Mon Entreprise",
      default_tva_rate: 20,
      invoice_prefix: "FACT-",
      invoice_next_number: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Erreur lors de l'insertion des paramètres par défaut:", insertError)
      return false
    }

    return true
  } catch (error) {
    console.error("Erreur lors de la création des paramètres par défaut:", error)
    return false
  }
}
