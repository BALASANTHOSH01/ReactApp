"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  useEffect(() => {
    if (!error && !errorDescription) {
      router.push("/auth")
    }
  }, [error, errorDescription, router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Authentication Error</h1>
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-md mb-6">
          <p className="font-semibold">{error}</p>
          <p>{errorDescription}</p>
        </div>
        <p className="text-zinc-400 mb-6">
          {error === "access_denied" && errorDescription?.includes("expired")
            ? "Your login link has expired. Please request a new one."
            : "An error occurred during authentication. Please try again."}
        </p>
        <Link
          href="/auth"
          className="bg-white text-black px-6 py-2 rounded-md hover:bg-zinc-200 transition-colors duration-300"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}

