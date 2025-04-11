export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  avatarUrl?: string
  role: "admin" | "user"
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  userId: string
  firstName?: string
  lastName?: string
  phone?: string
  position?: string
  company?: string
  avatarUrl?: string
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface UpdatePasswordRequest {
  password: string
  token: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  position?: string
  company?: string
  avatarUrl?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}
