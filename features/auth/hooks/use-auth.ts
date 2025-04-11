"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  login as loginAction,
  signup as signupAction,
  logout as logoutAction,
  getCurrentUser,
  getUserProfile,
  updateProfile as updateProfileAction,
} from "../actions"
import type { LoginCredentials, SignupCredentials, UpdateProfileRequest, UserProfile, AuthState } from "../types"

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const loadUser = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      const user = await getCurrentUser()

      if (user) {
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        })

        // Charger le profil de l'utilisateur
        const userProfile = await getUserProfile(user.id)
        setProfile(userProfile)
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
        setProfile(null)
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'utilisateur:", error)
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (credentials: LoginCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      const { user, error } = await loginAction(credentials)

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error,
          variant: "destructive",
        })
        setState((prev) => ({ ...prev, isLoading: false }))
        return false
      }

      if (user) {
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        })

        // Charger le profil de l'utilisateur
        const userProfile = await getUserProfile(user.id)
        setProfile(userProfile)

        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${user.firstName || user.email}!`,
        })

        return true
      }

      setState((prev) => ({ ...prev, isLoading: false }))
      return false
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      })
      setState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const signup = async (credentials: SignupCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      const { user, error } = await signupAction(credentials)

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error,
          variant: "destructive",
        })
        setState((prev) => ({ ...prev, isLoading: false }))
        return false
      }

      if (user) {
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        })

        toast({
          title: "Inscription réussie",
          description: `Bienvenue ${user.firstName || user.email}!`,
        })

        return true
      }

      setState((prev) => ({ ...prev, isLoading: false }))
      return false
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      })
      setState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      const { error } = await logoutAction()

      if (error) {
        toast({
          title: "Erreur de déconnexion",
          description: error,
          variant: "destructive",
        })
        setState((prev) => ({ ...prev, isLoading: false }))
        return false
      }

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      setProfile(null)

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })

      router.push("/login")
      return true
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      })
      setState((prev) => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const updateUserProfile = async (data: UpdateProfileRequest) => {
    try {
      if (!state.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour mettre à jour votre profil",
          variant: "destructive",
        })
        return false
      }

      const { profile: updatedProfile, error } = await updateProfileAction(state.user.id, data)

      if (error) {
        toast({
          title: "Erreur de mise à jour du profil",
          description: error,
          variant: "destructive",
        })
        return false
      }

      if (updatedProfile) {
        setProfile(updatedProfile)

        // Mettre à jour l'utilisateur avec les nouvelles informations
        setState((prev) => ({
          ...prev,
          user: prev.user
            ? {
                ...prev.user,
                firstName: updatedProfile.firstName,
                lastName: updatedProfile.lastName,
                fullName:
                  updatedProfile.firstName && updatedProfile.lastName
                    ? `${updatedProfile.firstName} ${updatedProfile.lastName}`
                    : prev.user.fullName,
                avatarUrl: updatedProfile.avatarUrl,
                updatedAt: updatedProfile.updatedAt,
              }
            : null,
        }))

        toast({
          title: "Profil mis à jour",
          description: "Votre profil a été mis à jour avec succès",
        })

        return true
      }

      return false
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      toast({
        title: "Erreur de mise à jour du profil",
        description: "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    user: state.user,
    profile,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    login,
    signup,
    logout,
    updateProfile: updateUserProfile,
    refreshUser: loadUser,
  }
}
