"use client"

import { AIAssistant as NewAIAssistant } from "@/features/ai-assistant/components/ai-assistant"

// Ce composant est maintenant un simple wrapper pour la nouvelle implémentation
// Conservé pour maintenir la compatibilité avec les imports existants
export function AIAssistant() {
  return <NewAIAssistant />
}
