import Image from "next/image"
import { Check } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Créez votre compte",
    description: "Inscrivez-vous en quelques secondes et configurez votre profil d'entreprise.",
    image: "/placeholder.svg?height=400&width=600",
    features: ["Inscription rapide", "Configuration guidée", "Personnalisation complète"],
  },
  {
    number: "02",
    title: "Ajoutez vos clients et produits",
    description: "Importez ou créez facilement votre base de clients et votre catalogue de produits/services.",
    image: "/placeholder.svg?height=400&width=600",
    features: ["Import CSV/Excel", "Création assistée par IA", "Catégorisation automatique"],
  },
  {
    number: "03",
    title: "Générez vos factures",
    description: "Créez des factures professionnelles en quelques clics ou demandez à l'IA de le faire pour vous.",
    image: "/placeholder.svg?height=400&width=600",
    features: ["Modèles personnalisables", "Génération par IA", "Envoi automatique"],
  },
]

export function HowItWorks() {
  return (
    <section className="bg-muted/50 py-20" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Comment ça marche</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Invoxia AI simplifie votre processus de facturation en trois étapes simples.
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-8 md:flex-row ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="w-full md:w-1/2">
                <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-primary/20 bg-background shadow-xl">
                  <Image
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                  Étape {step.number}
                </div>
                <h3 className="mb-4 text-2xl font-bold md:text-3xl">{step.title}</h3>
                <p className="mb-6 text-lg text-muted-foreground">{step.description}</p>
                <ul className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
