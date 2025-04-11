import { SignupForm } from "@/features/auth/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 w-full">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 rounded-md bg-primary p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary-foreground"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Invoxia AI</h1>
        <p className="text-sm text-muted-foreground">Facturation intelligente avec IA générative</p>
      </div>
      <SignupForm />
    </div>
  )
}
