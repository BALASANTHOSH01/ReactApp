"use client"

import { useState } from "react"

import { Button } from "../components/ui/Button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-white">
            StudyHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/materials" className="text-white/70 hover:text-white transition-colors">
              Materials
            </Link>
            <Link to="/#about" className="text-white/70 hover:text-white transition-colors">
              About
            </Link>
            {/* <Button variant="outline" className="text-white border-white/20">
              Sign In
            </Button> */}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-black/90 border-b border-white/10"
          >
            <div className="container text-[20] mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link to="/" className="text-white/70 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/materials" className="text-white/70 hover:text-white transition-colors">
                Materials
              </Link>
              <Link to="/#about" className="text-white/70 hover:text-white transition-colors">
                About
              </Link>
              {/* <Button variant="outline" className="text-white border-white/20">
                Sign In
              </Button> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

