"use client"

import { Button } from "@/components/ui/button"

interface SuggestionButtonProps {
  suggestion: string
  onClick: (suggestion: string) => void
  disabled?: boolean
}

export function SuggestionButton({ suggestion, onClick, disabled }: SuggestionButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-auto whitespace-normal text-left"
      onClick={() => onClick(suggestion)}
      disabled={disabled}
    >
      {suggestion}
    </Button>
  )
}
