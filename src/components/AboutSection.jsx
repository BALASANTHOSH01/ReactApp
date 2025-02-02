"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../components/ui/Card"
import { Book, Users, Trophy } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-zinc-900 ">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About StudyHub</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            We&apos;re dedicated to making learning accessible, engaging, and effective for students worldwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Book,
              title: "Quality Content",
              description: "Curated study materials from expert educators",
            },
            {
              icon: Users,
              title: "Community Learning",
              description: "Connect with peers and learn together",
            },
            {
              icon: Trophy,
              title: "Achievement Tracking",
              description: "Monitor your progress and celebrate success",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="p-6 text-center">
                  <item.icon className="w-12 h-12 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

