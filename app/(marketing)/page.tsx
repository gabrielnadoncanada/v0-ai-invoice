import { HeroSection } from "@/features/landing/components/hero-section"
import { FeaturesSection } from "@/features/landing/components/features-section"
import { HowItWorks } from "@/features/landing/components/how-it-works"
import { Testimonials } from "@/features/landing/components/testimonials"
import { Pricing } from "@/features/landing/components/pricing"
import { FAQ } from "@/features/landing/components/faq"
import { CTASection } from "@/features/landing/components/cta-section"
import { Footer } from "@/features/landing/components/footer"
import { Navbar } from "@/features/landing/components/navbar"

export default function LandingPage() {
  return (
    <>
     <div className="flex flex-col w-full">
        <Navbar />
        <main className="pt-16">
          <HeroSection />
          <FeaturesSection />
          <HowItWorks />
          <Testimonials />
          <Pricing />
          <FAQ />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  )
}
