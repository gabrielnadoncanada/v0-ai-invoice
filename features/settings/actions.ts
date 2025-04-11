"use server"

import { settingsService } from "./api/settings-service"
import type { BusinessSettings } from "./types"

export async function fetchBusinessSettings(): Promise<BusinessSettings | null> {
  return settingsService.fetchBusinessSettings()
}

export async function updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings | null> {
  return settingsService.updateBusinessSettings(settings)
}
