import { createClientSupabaseClient } from "@/lib/supabase"
import type {
  User,
  LoginCredentials,
  SignupCredentials,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  UserProfile,
  UpdateProfileRequest,
} from "../types"

export class AuthService {
  async login({ email, password }: LoginCredentials): Promise<{ user: User | null; error: Error | null }> {
    try {
      const supabase = createClientSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        return { user: null, error: null }
      }

      // Récupérer les informations supplémentaires de l'utilisateur depuis la table profiles
      const { data: profileData } = await supabase.from("profiles").select("*").eq("user_id", data.user.id).single()

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        firstName: profileData?.first_name,
        lastName: profileData?.last_name,
        fullName:
          profileData?.first_name && profileData?.last_name
            ? `${profileData.first_name} ${profileData.last_name}`
            : undefined,
        avatarUrl: profileData?.avatar_url,
        role: profileData?.role || "user",
        createdAt: new Date(data.user.created_at!),
        updatedAt: new Date(profileData?.updated_at || data.user.updated_at!),
      }

      return { user, error: null }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      return { user: null, error: error as Error }
    }
  }

  async signup({
    email,
    password,
    firstName,
    lastName,
  }: SignupCredentials): Promise<{ user: User | null; error: Error | null }> {
    try {
      const supabase = createClientSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        return { user: null, error: null }
      }

      // Créer un profil pour l'utilisateur
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        role: "user",
        updated_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError)
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        firstName,
        lastName,
        fullName: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        role: "user",
        createdAt: new Date(data.user.created_at!),
        updatedAt: new Date(),
      }

      return { user, error: null }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      return { user: null, error: error as Error }
    }
  }

  async logout(): Promise<{ error: Error | null }> {
    try {
      const supabase = createClientSupabaseClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      return { error: error as Error }
    }
  }

  async resetPassword({ email }: ResetPasswordRequest): Promise<{ error: Error | null }> {
    try {
      const supabase = createClientSupabaseClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation du mot de passe:", error)
      return { error: error as Error }
    }
  }

  async updatePassword({ password, token }: UpdatePasswordRequest): Promise<{ error: Error | null }> {
    try {
      const supabase = createClientSupabaseClient()
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error)
      return { error: error as Error }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const supabase = createClientSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return null
      }

      // Récupérer les informations supplémentaires de l'utilisateur depuis la table profiles
      const { data: profileData } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

      return {
        id: user.id,
        email: user.email!,
        firstName: profileData?.first_name,
        lastName: profileData?.last_name,
        fullName:
          profileData?.first_name && profileData?.last_name
            ? `${profileData.first_name} ${profileData.last_name}`
            : undefined,
        avatarUrl: profileData?.avatar_url,
        role: profileData?.role || "user",
        createdAt: new Date(user.created_at!),
        updatedAt: new Date(profileData?.updated_at || user.updated_at!),
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur courant:", error)
      return null
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const supabase = createClientSupabaseClient()
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

      if (error) {
        throw error
      }

      if (!data) {
        return null
      }

      return {
        id: data.id,
        userId: data.user_id,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        position: data.position,
        company: data.company,
        avatarUrl: data.avatar_url,
        updatedAt: new Date(data.updated_at),
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur:", error)
      return null
    }
  }

  async updateProfile(
    userId: string,
    profile: UpdateProfileRequest,
  ): Promise<{ profile: UserProfile | null; error: Error | null }> {
    try {
      const supabase = createClientSupabaseClient()

      // Convertir les champs du modèle vers la structure de la base de données
      const dbUpdates: any = {
        updated_at: new Date().toISOString(),
      }

      if (profile.firstName !== undefined) dbUpdates.first_name = profile.firstName
      if (profile.lastName !== undefined) dbUpdates.last_name = profile.lastName
      if (profile.phone !== undefined) dbUpdates.phone = profile.phone
      if (profile.position !== undefined) dbUpdates.position = profile.position
      if (profile.company !== undefined) dbUpdates.company = profile.company
      if (profile.avatarUrl !== undefined) dbUpdates.avatar_url = profile.avatarUrl

      // Vérifier si le profil existe déjà
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("user_id", userId).single()

      let result
      if (existingProfile) {
        // Mise à jour
        const { data, error } = await supabase
          .from("profiles")
          .update(dbUpdates)
          .eq("user_id", userId)
          .select()
          .single()

        if (error) {
          throw error
        }

        result = data
      } else {
        // Création
        const { data, error } = await supabase
          .from("profiles")
          .insert({
            user_id: userId,
            ...dbUpdates,
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        result = data
      }

      return {
        profile: {
          id: result.id,
          userId: result.user_id,
          firstName: result.first_name,
          lastName: result.last_name,
          phone: result.phone,
          position: result.position,
          company: result.company,
          avatarUrl: result.avatar_url,
          updatedAt: new Date(result.updated_at),
        },
        error: null,
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      return { profile: null, error: error as Error }
    }
  }
}

// Exporter une instance singleton du service
export const authService = new AuthService()
