"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, Trophy } from "lucide-react"

const features = [
  {
    title: "Quality Content",
    description: "Curated study materials from expert educators",
    icon: BookOpen,
  },
  {
    title: "Community Learning",
    description: "Connect with peers and learn together",
    icon: Users,
  },
  {
    title: "Achievement Tracking",
    description: "Monitor your progress and celebrate success",
    icon: Trophy,
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">About StudyHub</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            We're dedicated to making learning accessible, engaging, and effective for students worldwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 text-center hover:bg-zinc-750 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <feature.icon className="w-12 h-12 text-white mb-4 mx-auto" />
              <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

