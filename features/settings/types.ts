export interface BusinessSettings {
  id: string
  name: string
  logo?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  siret?: string
  tvaNumber?: string
  defaultTvaRate: number
  invoicePrefix: string
  invoiceNextNumber: number
  primaryColor?: string
  secondaryColor?: string
  termsAndConditions?: string
  bankDetails?: string
  createdAt: Date
  updatedAt: Date
}

export interface BusinessSettingsFormData {
  name: string
  logo?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  siret?: string
  tvaNumber?: string
  defaultTvaRate: number
  invoicePrefix: string
  invoiceNextNumber: number
  primaryColor?: string
  secondaryColor?: string
  termsAndConditions?: string
  bankDetails?: string
}
