import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Comment fonctionne l'assistant IA d'Invoxia ?",
    answer:
      "L'assistant IA d'Invoxia utilise le traitement du langage naturel pour comprendre vos demandes et y répondre. Vous pouvez lui demander de créer des factures, de rechercher des clients, d'analyser vos revenus ou de générer des rapports, le tout en langage courant.",
  },
  {
    question: "Puis-je importer mes données existantes ?",
    answer:
      "Oui, Invoxia AI vous permet d'importer facilement vos clients, produits et factures existants via des fichiers CSV ou Excel. Nous proposons également des intégrations avec les logiciels de comptabilité les plus populaires.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Absolument. La sécurité est notre priorité. Toutes vos données sont chiffrées de bout en bout, stockées sur des serveurs sécurisés en Europe et conformes au RGPD. Nous effectuons régulièrement des audits de sécurité et des sauvegardes automatiques.",
  },
  {
    question: "Puis-je personnaliser mes factures ?",
    answer:
      "Oui, vous pouvez entièrement personnaliser vos factures avec votre logo, vos couleurs, et votre mise en page. Nous proposons plusieurs modèles professionnels que vous pouvez adapter à votre image de marque.",
  },
  {
    question: "Invoxia AI est-il compatible avec mon comptable ?",
    answer:
      "Oui, Invoxia AI permet d'exporter vos données dans des formats compatibles avec la plupart des logiciels de comptabilité. Vous pouvez également donner un accès limité à votre comptable pour qu'il puisse consulter et télécharger les documents nécessaires.",
  },
  {
    question: "Y a-t-il une période d'essai gratuite ?",
    answer:
      "Oui, nous proposons une période d'essai gratuite de 14 jours pour tous nos plans, sans carte de crédit requise. Vous pourrez explorer toutes les fonctionnalités et décider si Invoxia AI correspond à vos besoins.",
  },
]

export function FAQ() {
  return (
    <section className="bg-muted/30 py-20" id="faq">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Questions fréquentes</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Vous avez des questions ? Nous avons des réponses.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Vous ne trouvez pas la réponse à votre question ?{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contactez notre équipe
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
