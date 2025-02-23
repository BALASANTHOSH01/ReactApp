"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Module {
  id: string
  module_name: string
  document_title: string
  description: string
}

export function FeaturedModules() {
  const [modules, setModules] = useState<Module[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchModules() {
      const { data, error } = await supabase
        .from("study_materials")
        .select("id, module_name, document_title, description")
        .limit(3)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching modules:", error)
      } else {
        setModules(data)
      }
    }

    fetchModules()
  }, [supabase])

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Modules</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Explore some of our latest and most popular study materials
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="p-6">
                <FileText className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{module.document_title}</h3>
                <p className="text-zinc-400 mb-4">{module.description}</p>
                <p className="text-sm text-zinc-500 mb-4">Module: {module.module_name}</p>
                <Link
                  href={`/materials#${module.id}`}
                  className="inline-flex items-center text-white hover:text-zinc-300 transition-colors duration-300"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/materials"
            className="inline-flex items-center bg-white text-black px-6 py-3 rounded-md text-lg font-semibold hover:bg-zinc-200 transition-colors duration-300"
          >
            View All Modules <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

