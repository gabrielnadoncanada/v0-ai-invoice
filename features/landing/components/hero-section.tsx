import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Simplifiez votre facturation avec l'intelligence artificielle
          </h1>
          <p className="mb-10 text-xl text-muted-foreground md:text-2xl">
            Invoxia AI automatise votre facturation, réduit les erreurs et vous fait gagner du temps grâce à l'IA
            générative.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8">
              <Link href="/signup">
                Essayer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#demo">Voir la démo</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      <div className="absolute -top-24 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"></div>
    </section>
  )
}
