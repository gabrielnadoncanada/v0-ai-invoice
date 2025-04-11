"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Menu, X } from "lucide-react"

const navLinks = [
  { name: "Fonctionnalités", href: "#features" },
  { name: "Comment ça marche", href: "#how-it-works" },
  { name: "Témoignages", href: "#testimonials" },
  { name: "Tarifs", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Invoxia AI</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Essayer gratuitement</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Ouvrir le menu</span>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-4">
              <Button asChild variant="outline" className="w-full justify-center">
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild className="w-full justify-center">
                <Link href="/signup">Essayer gratuitement</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
