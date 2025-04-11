import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    description: "Parfait pour les freelances et les petites entreprises",
    price: "19",
    features: [
      "Jusqu'à 50 factures par mois",
      "Jusqu'à 25 clients",
      "Modèles de facture de base",
      "Assistant IA (limité)",
      "Exportation PDF",
      "Support par email",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Pro",
    description: "Idéal pour les PME en croissance",
    price: "49",
    features: [
      "Factures illimitées",
      "Clients illimités",
      "Modèles de facture personnalisables",
      "Assistant IA complet",
      "Intégration comptable",
      "Rapports avancés",
      "Support prioritaire",
    ],
    cta: "Essayer 14 jours gratuits",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Pour les grandes entreprises avec des besoins spécifiques",
    price: "99",
    features: [
      "Tout ce qui est inclus dans Pro",
      "API complète",
      "Personnalisation avancée",
      "Intégrations sur mesure",
      "Gestionnaire de compte dédié",
      "SLA garanti",
      "Formation personnalisée",
    ],
    cta: "Contacter les ventes",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section className="py-20" id="pricing">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Tarifs simples et transparents</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choisissez le plan qui correspond le mieux aux besoins de votre entreprise.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col ${
                plan.popular
                  ? "relative border-2 border-primary shadow-lg"
                  : "border border-border shadow-sm hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                  Recommandé
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-muted-foreground"> /mois</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                  <Link href="/signup">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Tous les prix sont hors taxes. Annulez à tout moment. Besoin d'une solution personnalisée ?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contactez-nous
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
