"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export interface UseFormOptions<T> {
  initialData?: T
  onSubmit: (data: T) => Promise<any>
  onSuccess?: (result: any) => void
  successMessage?: string
  errorMessage?: string
}

export function useForm<T extends Record<string, any>>({
  initialData,
  onSubmit,
  onSuccess,
  successMessage = "Opération réussie",
  errorMessage = "Une erreur est survenue",
}: UseFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialData || ({} as T))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, name, value, type } = e.target
    const fieldName = name || id

    setFormData((prev) => ({
      ...prev,
      [fieldName]: type === "number" ? Number.parseFloat(value) : value,
    }))

    // Effacer l'erreur pour ce champ s'il y en a une
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (fieldName: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      const result = await onSubmit(formData)

      toast({
        title: "Succès",
        description: successMessage,
      })

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error)

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })

      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const setFieldValue = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const setFieldError = (fieldName: string, errorMessage: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }))
  }

  return {
    formData,
    isSubmitting,
    errors,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFormData,
  }
}
