import { createServerSupabaseClient } from "./supabase"
import type { Database } from "./database.types"

export type TableName = keyof Database["public"]["Tables"]

export class BaseService<T extends TableName> {
  protected tableName: T

  constructor(tableName: T) {
    this.tableName = tableName
  }

  protected getSupabase() {
    return createServerSupabaseClient()
  }

  async findAll(options?: {
    orderBy?: string
    orderDirection?: "asc" | "desc"
    filters?: Record<string, any>
  }) {
    const supabase = this.getSupabase()
    let query = supabase.from(this.tableName).select("*")

    // Appliquer les filtres
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value === null) {
            query = query.is(key, null)
          } else {
            query = query.eq(key, value)
          }
        }
      })
    }

    // Appliquer le tri
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.orderDirection !== "desc" })
    }

    const { data, error } = await query

    if (error) {
      console.error(`Erreur lors de la récupération des données de ${this.tableName}:`, error)
      return []
    }

    return data
  }

  async findById(id: string) {
    const supabase = this.getSupabase()
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single()

    if (error) {
      console.error(`Erreur lors de la récupération de l'élément ${id} de ${this.tableName}:`, error)
      return null
    }

    return data
  }

  async create(item: any) {
    const supabase = this.getSupabase()
    const { data, error } = await supabase.from(this.tableName).insert(item).select().single()

    if (error) {
      console.error(`Erreur lors de la création d'un élément dans ${this.tableName}:`, error)
      throw new Error(`Erreur lors de la création: ${error.message}`)
    }

    return data
  }

  async update(id: string, updates: any) {
    const supabase = this.getSupabase()
    const { data, error } = await supabase.from(this.tableName).update(updates).eq("id", id).select().single()

    if (error) {
      console.error(`Erreur lors de la mise à jour de l'élément ${id} de ${this.tableName}:`, error)
      return null
    }

    return data
  }

  async delete(id: string) {
    const supabase = this.getSupabase()
    const { error } = await supabase.from(this.tableName).delete().eq("id", id)

    if (error) {
      console.error(`Erreur lors de la suppression de l'élément ${id} de ${this.tableName}:`, error)
      return false
    }

    return true
  }
}
