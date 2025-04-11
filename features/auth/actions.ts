"use server"

import { authService } from "./api/auth-service"
import type {
  LoginCredentials,
  SignupCredentials,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  User,
  UserProfile,
} from "./types"

export async function login(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
  try {
    const { user, error } = await authService.login(credentials)

    if (error) {
      return { user: null, error: error.message }
    }

    return { user, error: null }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return {
      user: null,
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion",
    }
  }
}

export async function signup(credentials: SignupCredentials): Promise<{ user: User | null; error: string | null }> {
  try {
    const { user, error } = await authService.signup(credentials)

    if (error) {
      return { user: null, error: error.message }
    }

    return { user, error: null }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return {
      user: null,
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription",
    }
  }
}

export async function logout(): Promise<{ error: string | null }> {
  try {
    const { error } = await authService.logout()

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error)
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la déconnexion",
    }
  }
}

export async function resetPassword(request: ResetPasswordRequest): Promise<{ error: string | null }> {
  try {
    const { error } = await authService.resetPassword(request)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation du mot de passe:", error)
    return {
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la demande de réinitialisation du mot de passe",
    }
  }
}

export async function updatePassword(request: UpdatePasswordRequest): Promise<{ error: string | null }> {
  try {
    const { error } = await authService.updatePassword(request)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error)
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du mot de passe",
    }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return authService.getCurrentUser()
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return authService.getUserProfile(userId)
}

export async function updateProfile(
  userId: string,
  profile: UpdateProfileRequest,
): Promise<{ profile: UserProfile | null; error: string | null }> {
  try {
    const { profile: updatedProfile, error } = await authService.updateProfile(userId, profile)

    if (error) {
      return { profile: null, error: error.message }
    }

    return { profile: updatedProfile, error: null }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return {
      profile: null,
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du profil",
    }
  }
}
