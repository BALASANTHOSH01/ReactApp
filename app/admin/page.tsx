"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast, Toaster } from "sonner"
import { Loader2, Plus, X, Edit, Trash2, Eye, ChevronDown, ChevronUp, Upload, List } from "lucide-react"
import { useAuth } from "@/hook/useAuth"

interface ModuleInput {
  id: string
  moduleName: string
  documentTitle: string
  description: string
  file: File | null
}

interface StudyMaterial {
  id: string
  module_name: string
  document_title: string
  description: string
  file_url: string
  file_path: string
  created_at: string
}

const emptyModule = (): ModuleInput => ({
  id: crypto.randomUUID(),
  moduleName: "",
  documentTitle: "",
  description: "",
  file: null,
})

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [modules, setModules] = useState<ModuleInput[]>([emptyModule()])
  const [uploading, setUploading] = useState(false)
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([])
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null)
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload")
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: string }>({})

  const fetchStudyMaterials = useCallback(async () => {
    const { data, error } = await supabase.from("study_materials").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching study materials:", error)
      toast.error("Failed to load study materials")
    } else {
      setStudyMaterials(data)
    }
  }, [supabase])

  useEffect(() => {
    if (!authLoading && user && user.user_metadata?.role !== "admin") {
      console.log("User is not admin, redirecting to materials")
      router.push("/materials")
    } else if (user && user.user_metadata?.role === "admin") {
      fetchStudyMaterials()
    }
  }, [user, authLoading, router, fetchStudyMaterials])

  const addModule = () => {
    setModules((prev) => [...prev, emptyModule()])
  }

  const removeModule = (id: string) => {
    setModules((prev) => prev.filter((module) => module.id !== id))
  }

  const updateModule = (id: string, field: keyof ModuleInput, value: string | File | null) => {
    setModules((prev) => prev.map((module) => (module.id === id ? { ...module, [field]: value } : module)))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const files = e.target.files
    if (files && files[0]) {
      updateModule(id, "file", files[0])
      setSelectedFiles((prev) => ({ ...prev, [id]: files[0].name }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("You must be logged in to upload modules")
      return
    }

    if (modules.some((module) => !module.file)) {
      toast.error("Please select a file for each module")
      return
    }

    setUploading(true)
    const toastId = toast.loading("Uploading modules...")

    try {
      for (const moduleItem of modules) {
        const { file } = moduleItem
        if (!file) continue

        toast.loading(`Uploading ${moduleItem.documentTitle}...`, { id: toastId })

        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage.from("study-materials").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

        if (uploadError) {
          throw new Error(`Failed to upload file: ${uploadError.message}`)
        }

        const { data: publicUrlData } = supabase.storage.from("study-materials").getPublicUrl(filePath)

        if (!publicUrlData) {
          throw new Error("Failed to get public URL for the uploaded file")
        }

        const fileUrl = publicUrlData.publicUrl

        const { error: insertError } = await supabase.from("study_materials").insert({
          module_name: moduleItem.moduleName,
          document_title: moduleItem.documentTitle,
          description: moduleItem.description,
          file_url: fileUrl,
          file_path: filePath,
          created_by: user.id,
        })

        if (insertError) {
          await supabase.storage.from("study-materials").remove([filePath])
          throw new Error(`Failed to add document to database: ${insertError.message}`)
        }
      }

      toast.success("All modules uploaded successfully!", { id: toastId })
      setModules([emptyModule()])
      fetchStudyMaterials()
    } catch (error) {
      console.error("Error uploading modules:", error)
      toast.error(`Error uploading modules: ${(error as Error).message}. Please try again.`, { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const handleEdit = (material: StudyMaterial) => {
    setEditingMaterial(material)
  }

  const handleDelete = async (material: StudyMaterial) => {
    if (confirm("Are you sure you want to delete this material?")) {
      const { error: deleteError } = await supabase.from("study_materials").delete().eq("id", material.id)

      if (deleteError) {
        toast.error(`Failed to delete material: ${deleteError.message}`)
      } else {
        await supabase.storage.from("study-materials").remove([material.file_path])
        toast.success("Material deleted successfully")
        fetchStudyMaterials()
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMaterial) return

    const { error: updateError } = await supabase
      .from("study_materials")
      .update({
        module_name: editingMaterial.module_name,
        document_title: editingMaterial.document_title,
        description: editingMaterial.description,
      })
      .eq("id", editingMaterial.id)

    if (updateError) {
      toast.error(`Failed to update material: ${updateError.message}`)
    } else {
      toast.success("Material updated successfully")
      setEditingMaterial(null)
      fetchStudyMaterials()
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user || user.user_metadata?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <Toaster position="top-center" />
      <div className="max-w-[70vw] mx-auto">
        <div className="bg-zinc-900 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Admin Dashboard</h1>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-300 ${
                activeTab === "upload" ? "bg-white text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              <Upload className="w-5 h-5" />
              Upload Modules
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-300 ${
                activeTab === "manage" ? "bg-white text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              <List className="w-5 h-5" />
              Manage Modules
            </button>
          </div>

          {activeTab === "upload" && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-zinc-800 p-6 rounded-lg relative border border-zinc-700 transition-all duration-300 hover:border-zinc-500"
                >
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(module.id)}
                      className="absolute top-2 right-2 text-zinc-400 hover:text-white"
                      disabled={uploading}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Module Name</label>
                      <input
                        type="text"
                        value={module.moduleName}
                        onChange={(e) => updateModule(module.id, "moduleName", e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg"
                        placeholder="Enter module name"
                        required
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Document Title</label>
                      <input
                        type="text"
                        value={module.documentTitle}
                        onChange={(e) => updateModule(module.id, "documentTitle", e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg"
                        placeholder="Enter document title"
                        required
                        disabled={uploading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
                      <textarea
                        value={module.description}
                        onChange={(e) => updateModule(module.id, "description", e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg resize-none"
                        placeholder="Enter description"
                        rows={3}
                        required
                        disabled={uploading}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-300 mb-1">
                        Upload File (PDF, DOC, DOCX)
                      </label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, module.id)}
                        className="w-full px-4 py-3 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg"
                        accept=".pdf,.doc,.docx"
                        required
                        disabled={uploading}
                      />
                      {selectedFiles[module.id] && (
                        <p className="mt-2 text-sm text-zinc-400">Selected file: {selectedFiles[module.id]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={addModule}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-all duration-300 hover:scale-105"
                  disabled={uploading}
                >
                  <Plus className="w-5 h-5" />
                  Add Another Module
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-md hover:bg-zinc-200 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload All"
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === "manage" && (
            <div className="space-y-4">
              {studyMaterials.length === 0 ? (
                <p className="text-center text-zinc-400">No study materials available.</p>
              ) : (
                studyMaterials.map((material) => (
                  <div key={material.id} className="bg-zinc-800 rounded-lg p-4">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleModule(material.id)}
                    >
                      <h3 className="text-xl font-semibold text-white">{material.document_title}</h3>
                      {expandedModules.includes(material.id) ? (
                        <ChevronUp className="w-6 h-6 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-zinc-400" />
                      )}
                    </div>
                    {expandedModules.includes(material.id) && (
                      <div className="mt-4 space-y-2">
                        <p className="text-zinc-300">
                          <span className="font-semibold">Module:</span> {material.module_name}
                        </p>
                        <p className="text-zinc-300">
                          <span className="font-semibold">Description:</span> {material.description}
                        </p>
                        <p className="text-zinc-300">
                          <span className="font-semibold">Created at:</span>{" "}
                          {new Date(material.created_at).toLocaleString()}
                        </p>
                        <div className="flex space-x-2 mt-4">
                          <a
                            href={material.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-all duration-300"
                          >
                            <Eye className="w-5 h-5" />
                            View
                          </a>
                          <button
                            onClick={() => handleEdit(material)}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-all duration-300"
                          >
                            <Edit className="w-5 h-5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(material)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {editingMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Edit Study Material</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Module Name</label>
                  <input
                    type="text"
                    value={editingMaterial.module_name}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, module_name: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Document Title</label>
                  <input
                    type="text"
                    value={editingMaterial.document_title}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, document_title: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
                  <textarea
                    value={editingMaterial.description}
                    onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white resize-none"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingMaterial(null)}
                    className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

