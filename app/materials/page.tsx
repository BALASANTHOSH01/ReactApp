"use client"

import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, ChevronDown, ChevronUp, Download, Eye, Search, Filter, X, Calendar } from "lucide-react"
import { useAuth } from "@/hook/useAuth"

interface Submodule {
  id: string
  name: string
  fileUrl: string
  description: string
  createdAt: string
}

interface Module {
  id: string
  name: string
  submodules: Submodule[]
}

export default function MaterialsPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string } | null>(null)
  const [filterDate, setFilterDate] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data, error } = await supabase
          .from("study_materials")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        const modulesData: Module[] = data.reduce((acc: Module[], item) => {
          const existingModule = acc.find((m) => m.name === item.module_name)
          if (existingModule) {
            existingModule.submodules.push({
              id: item.id,
              name: item.document_title,
              fileUrl: item.file_url,
              description: item.description,
              createdAt: item.created_at,
            })
          } else {
            acc.push({
              id: item.id,
              name: item.module_name,
              submodules: [
                {
                  id: item.id,
                  name: item.document_title,
                  fileUrl: item.file_url,
                  description: item.description,
                  createdAt: item.created_at,
                },
              ],
            })
          }
          return acc
        }, [])

        setModules(modulesData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching materials:", err)
        setError("Failed to load study materials. Please try again later.")
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [supabase])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error downloading file:", err)
      alert("Failed to download the file. Please try again.")
    }
  }

  const filteredModules = modules.filter((module) => {
    const moduleMatches = module.name.toLowerCase().includes(searchTerm.toLowerCase())
    const submoduleMatches = module.submodules.some(
      (submodule) =>
        submodule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submodule.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    let dateMatches = true
    if (filterDate !== "all") {
      const today = new Date()
      const filterDays = Number.parseInt(filterDate)
      dateMatches = module.submodules.some((submodule) => {
        const createdDate = new Date(submodule.createdAt)
        const diffTime = Math.abs(today.getTime() - createdDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= filterDays
      })
    }

    return (moduleMatches || submoduleMatches) && dateMatches
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="mt-20 bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Study Materials</h1>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search modules or documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-zinc-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white pl-12 text-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full md:w-auto px-6 py-4 bg-zinc-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg flex items-center justify-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filter
              <ChevronDown className="w-5 h-5 ml-2" />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setFilterDate("all")
                      setIsFilterOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
                  >
                    All time
                  </button>
                  <button
                    onClick={() => {
                      setFilterDate("7")
                      setIsFilterOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
                  >
                    Last 7 days
                  </button>
                  <button
                    onClick={() => {
                      setFilterDate("30")
                      setIsFilterOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
                  >
                    Last 30 days
                  </button>
                  <button
                    onClick={() => {
                      setFilterDate("90")
                      setIsFilterOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
                  >
                    Last 90 days
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredModules.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">No study materials found.</div>
        ) : (
          <div className="space-y-6">
            {filteredModules.map((module) => (
              <div
                key={module.id}
                className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl border border-zinc-800"
              >
                <div
                  className="flex justify-between items-center p-6 cursor-pointer"
                  onClick={() => toggleModule(module.id)}
                >
                  <h2 className="text-2xl font-semibold text-white">{module.name}</h2>
                  {expandedModules.includes(module.id) ? (
                    <ChevronUp className="w-6 h-6 text-white" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-white" />
                  )}
                </div>
                {expandedModules.includes(module.id) && (
                  <div className="p-6 bg-zinc-800 border-t border-zinc-700">
                    {module.submodules.length === 0 ? (
                      <div className="text-gray-400">No documents available.</div>
                    ) : (
                      <div className="grid gap-4">
                        {module.submodules.map((submodule) => (
                          <div
                            key={submodule.id}
                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-zinc-900 rounded-lg"
                          >
                            <div className="mb-4 md:mb-0">
                              <h3 className="text-lg font-semibold text-white mb-1">{submodule.name}</h3>
                              <p className="text-sm text-gray-400">{submodule.description}</p>
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Added on: {new Date(submodule.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                              <button
                                onClick={() => handleDownload(submodule.fileUrl, `${submodule.name}.pdf`)}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors duration-200"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                              <button
                                onClick={() => setViewingDocument({ name: submodule.name, url: submodule.fileUrl })}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-lg w-full max-w-[70vw] h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-zinc-700">
              <h3 className="text-xl font-semibold text-white">{viewingDocument.name}</h3>
              <button
                onClick={() => setViewingDocument(null)}
                className="text-zinc-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-grow overflow-auto">
              <iframe src={viewingDocument.url} className="w-full h-full" title={viewingDocument.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

