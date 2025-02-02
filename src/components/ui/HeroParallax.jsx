"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"

export function HeroParallax() {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 200])

  return (
    <div ref={ref} className="relative h-[50vh] overflow-hidden bg-black">
      <motion.div style={{ y }} className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Study Smarter</h1>
          <p className="text-xl md:text-2xl">Your personalized learning journey begins here</p>
        </div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
    </div>
  )
}

