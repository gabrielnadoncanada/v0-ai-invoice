import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Singleton pour le client Supabase côté client
let clientSupabaseClient: ReturnType<typeof createClient<Database>> | null = null

// Client Supabase côté client
export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anon key must be provided")
  }

  clientSupabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return clientSupabaseClient
}

// Client Supabase côté serveur (à utiliser uniquement dans les composants serveur ou les actions serveur)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL and service key must be provided")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}
