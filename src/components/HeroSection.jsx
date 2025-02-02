"use client"

import { motion } from "framer-motion"
import { Button } from "../components/ui/Button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />

      {/* Animated dots */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/50" />
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-white/20 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Learn Smarter,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-white">Achieve More</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl mx-auto"
        >
          Your personalized learning journey begins here. Access comprehensive study materials and boost your academic
          performance.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
            <Link to={"/materials"}>
          <Button  size="lg" className="bg-white cursor-pointer text-black hover:bg-zinc-200">
            Get Started <ArrowRight className="ml-2" />
          </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

