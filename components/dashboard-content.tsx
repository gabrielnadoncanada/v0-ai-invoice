"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Download, Plus, TrendingUp, Users, FileText, CreditCard, MessageSquare } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-muted-foreground">Bienvenue sur votre tableau de bord Invoxia AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      <Tabs defaultValue="apercu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="factures">Factures</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
        </TabsList>
        <TabsContent value="apercu" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45 231 €</div>
                <p className="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">8 750 € à recevoir</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 ce mois-ci</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paiements reçus</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36 480 €</div>
                <p className="text-xs text-muted-foreground">+12.5% par rapport au mois dernier</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Aperçu des revenus</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                  Graphique des revenus
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Factures récentes</CardTitle>
                <CardDescription>Vos 5 dernières factures émises</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Facture #{2023100 + i}</p>
                        <p className="text-sm text-muted-foreground">Client {i}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{(Math.random() * 1000).toFixed(2)} €</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Assistant IA
              </CardTitle>
              <CardDescription>Posez vos questions ou demandez des actions à votre assistant IA</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p>Utilisez l'assistant IA pour gérer vos factures, clients et produits en langage naturel.</p>
                <p>Exemples de commandes:</p>
                <ul className="space-y-2 text-sm">
                  <li className="rounded-md bg-muted p-2">
                    "Crée un nouveau client avec le nom Société ABC et l'email contact@abc.fr"
                  </li>
                  <li className="rounded-md bg-muted p-2">"Liste toutes les factures payées"</li>
                  <li className="rounded-md bg-muted p-2">"Crée une nouvelle facture pour le client Entreprise ABC"</li>
                </ul>
                <Button asChild className="w-full mt-4">
                  <a href="/assistant">Ouvrir l'assistant IA</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="factures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Factures</CardTitle>
              <CardDescription>Gérez toutes vos factures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                Contenu des factures
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
              <CardDescription>Gérez vos clients et leurs informations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                Liste des clients
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paiements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paiements</CardTitle>
              <CardDescription>Suivez tous vos paiements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
                Historique des paiements
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
