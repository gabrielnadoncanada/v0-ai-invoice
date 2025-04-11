"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProfileForm } from "@/features/auth/components/profile-form"

export default function ProfilePage() {
  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profil</h2>
          <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences</p>
        </div>
        <ProfileForm />
      </div>
  )
}
