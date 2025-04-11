import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// Liste des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ["/", "/login", "/signup", "/reset-password"]

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Vérifier si l'utilisateur est authentifié
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Obtenir le chemin de la requête
  const path = request.nextUrl.pathname

  // Si l'utilisateur n'est pas authentifié et que la route n'est pas publique, rediriger vers la page de connexion
  if (!session && !publicRoutes.some((route) => path === route || path.startsWith(route))) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est authentifié et qu'il essaie d'accéder à une page d'authentification, rediriger vers la page du tableau de bord
  if (session && (path === "/login" || path === "/signup" || path.startsWith("/reset-password"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

// Configurer le middleware pour s'exécuter sur toutes les routes sauf les routes statiques
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
