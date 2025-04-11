import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Clock, BarChart3, MessageSquare, Shield } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Facturation automatisée",
    description: "Générez des factures professionnelles en quelques clics avec des modèles personnalisables.",
  },
  {
    icon: Zap,
    title: "IA générative",
    description: "Utilisez l'IA pour créer des descriptions de services et des conditions de paiement optimisées.",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Réduisez de 80% le temps consacré à la facturation et à la gestion administrative.",
  },
  {
    icon: BarChart3,
    title: "Analyses détaillées",
    description: "Visualisez vos performances financières avec des tableaux de bord intuitifs et personnalisables.",
  },
  {
    icon: MessageSquare,
    title: "Assistant IA",
    description: "Posez des questions en langage naturel pour gérer vos factures, clients et paiements.",
  },
  {
    icon: Shield,
    title: "Sécurité avancée",
    description: "Vos données sont protégées par un chiffrement de bout en bout et des sauvegardes automatiques.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20" id="features">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Fonctionnalités principales</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Découvrez comment Invoxia AI transforme votre processus de facturation avec des outils puissants et
            intelligents.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader>
                <feature.icon className="mb-3 h-10 w-10 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
