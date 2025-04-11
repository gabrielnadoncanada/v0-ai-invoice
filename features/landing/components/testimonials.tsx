import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon } from "lucide-react"

const testimonials = [
  {
    quote:
      "Invoxia AI a révolutionné notre processus de facturation. Nous économisons plus de 10 heures par semaine et nos clients sont ravis de la clarté de nos factures.",
    author: "Marie Dubois",
    role: "Directrice financière, TechStart SAS",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    quote:
      "L'assistant IA est incroyablement intuitif. Je lui demande simplement de créer une facture pour un client et tout est généré automatiquement avec précision.",
    author: "Thomas Martin",
    role: "Consultant indépendant",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    quote:
      "En tant que petite entreprise, nous n'avions pas les ressources pour un service comptable. Invoxia AI nous offre des fonctionnalités professionnelles à un prix abordable.",
    author: "Sophie Leroy",
    role: "Fondatrice, Artisan Digital",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
  },
]

export function Testimonials() {
  return (
    <section className="py-20" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ce que disent nos clients</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Découvrez comment Invoxia AI aide les entreprises à simplifier leur facturation et à gagner du temps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex h-full flex-col">
              <CardContent className="flex-1 pt-6">
                <div className="mb-4 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="mb-4 text-lg">"{testimonial.quote}"</blockquote>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
