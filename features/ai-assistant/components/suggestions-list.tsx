"use client"

import { SuggestionButton } from "./suggestion-button"

interface SuggestionsListProps {
  suggestions: string[]
  onSelectSuggestion: (suggestion: string) => void
  isLoading: boolean
}

export function SuggestionsList({ suggestions, onSelectSuggestion, isLoading }: SuggestionsListProps) {
  if (!suggestions.length) {
    return null
  }

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium">Suggestions :</h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <SuggestionButton key={index} suggestion={suggestion} onClick={onSelectSuggestion} disabled={isLoading} />
        ))}
      </div>
    </div>
  )
}
