"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"

interface ConfirmDeleteDialogProps {
  title?: string
  description?: string
  onConfirm: () => Promise<void>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ConfirmDeleteDialog({
  title = "Êtes-vous sûr de vouloir supprimer cet élément ?",
  description = "Cette action est irréversible. Toutes les données associées à cet élément seront supprimées.",
  onConfirm,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: ConfirmDeleteDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = isControlled ? setControlledOpen : setUncontrolledOpen

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      await onConfirm()
    } finally {
      setIsDeleting(false)
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Suppression...
              </>
            ) : (
              "Supprimer"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
