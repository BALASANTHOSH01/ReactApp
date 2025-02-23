import { HeroSection } from "@/components/Hero"
import { AboutSection } from "@/components/About"
import { FeaturedModules } from "@/components/FeaturedModules"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <AboutSection />
      <FeaturedModules/>
      <Footer/>
    </div>
  )
}

