import { HeroSection } from "../../components/HeroSection"
import { AboutSection } from "../../components/AboutSection"
import { Footer } from "../../components/Footer"
import { Navbar } from "../../components/Navbar"



export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <Footer />
    </div>
  )
}

