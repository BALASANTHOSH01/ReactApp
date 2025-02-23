"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/superbase"
import { Loader2 } from "lucide-react"

export default function ViewMaterial() {
  const params = useParams()
  const { moduleId, submoduleId } = params
  const [material, setMaterial] = useState<{ name: string; fileUrl: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const { data, error } = await supabase
          .from("study_materials")
          .select("document_title, file_url")
          .eq("id", submoduleId)
          .single()

        if (error) throw error

        if (data) {
          setMaterial({ name: data.document_title, fileUrl: data.file_url })
        } else {
          setError("Material not found")
        }
      } catch (err) {
        console.error("Error fetching material:", err)
        setError("Failed to load the material. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (moduleId && submoduleId) {
      fetchMaterial()
    }
  }, [moduleId, submoduleId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>
  }

  if (!material) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Material not found</div>
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">{material.name}</h1>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={material.fileUrl}
            className="w-full h-full"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}

