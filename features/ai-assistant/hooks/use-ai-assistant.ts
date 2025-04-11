"use client"

import { useReducer, useCallback } from "react"
import { executeAICommand } from "../api/ai-commands"
import type { AIAssistantState, AIAction } from "../types"

const initialSuggestions = [
  "Montre-moi les factures impayées",
  "Crée une nouvelle facture pour le client Dupont",
  "Quel est mon chiffre d'affaires ce mois-ci ?",
  "Liste mes clients les plus importants",
]

const initialState: AIAssistantState = {
  messages: [],
  isLoading: false,
}

function aiAssistantReducer(state: AIAssistantState, action: AIAction): AIAssistantState {
  switch (action.type) {
    case "ADD_USER_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, { role: "user", content: action.payload }],
        isLoading: true,
      }
    case "ADD_ASSISTANT_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, { role: "assistant", content: action.payload }],
        isLoading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "RESET_CONVERSATION":
      return initialState
    default:
      return state
  }
}

export function useAIAssistant() {
  const [state, dispatch] = useReducer(aiAssistantReducer, initialState)

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return

    // Ajouter le message de l'utilisateur
    dispatch({ type: "ADD_USER_MESSAGE", payload: message })

    try {
      // Simuler un délai pour l'IA (à remplacer par un vrai appel API)
      const result = await executeAICommand(message)

      // Ajouter la réponse de l'assistant
      dispatch({
        type: "ADD_ASSISTANT_MESSAGE",
        payload: result.message,
      })
    } catch (error) {
      console.error("Erreur lors de l'exécution de la commande IA:", error)
      dispatch({
        type: "ADD_ASSISTANT_MESSAGE",
        payload: "Désolé, j'ai rencontré une erreur lors du traitement de votre demande.",
      })
    }
  }, [])

  const resetConversation = useCallback(() => {
    dispatch({ type: "RESET_CONVERSATION" })
  }, [])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    sendMessage,
    resetConversation,
    suggestions: initialSuggestions,
  }
}
