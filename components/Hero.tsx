"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
      <div className="absolute inset-0 opacity-50">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzE3MTcxNyI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IiMzZjNmNDYiPjwvY2lyY2xlPgo8L3N2Zz4=')]" />
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Learn Smarter,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-white">Achieve More</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your personalized learning journey begins here. Access comprehensive study materials and boost your academic
          performance.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/materials"
            className="inline-flex items-center bg-white text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-zinc-200 transition-colors duration-300"
          >
            Get Started
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

