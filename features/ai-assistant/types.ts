export type MessageRole = "user" | "assistant" | "system"

export interface Message {
  role: MessageRole
  content: string
}

export interface AIAssistantState {
  messages: Message[]
  isLoading: boolean
}

export interface AIAction {
  type: string
  payload?: any
}

export interface AICommandResult {
  success: boolean
  message: string
  data?: any
}
