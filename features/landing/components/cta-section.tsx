import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">Prêt à simplifier votre facturation ?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
          Rejoignez des milliers d'entreprises qui font confiance à Invoxia AI pour leur facturation.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" variant="secondary" className="px-8">
            <Link href="/signup">
              Essayer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
        <p className="mt-6 text-sm opacity-80">Aucune carte de crédit requise. Essai gratuit de 14 jours.</p>
      </div>
    </section>
  )
}
