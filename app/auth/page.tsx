"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hook/useAuth"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      if (user.user_metadata?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/materials")
      }
    }
  }, [user, router])

  useEffect(() => {
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")
    if (error === "access_denied" && errorDescription) {
      setError(decodeURIComponent(errorDescription))
    }
  }, [searchParams])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (!isLogin && password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        console.log("Sign in data:", data)
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              role: "user", // Default role for new users
            },
          },
        })
        if (error) throw error
        setMessage("Check your email for the confirmation link.")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError((error as Error).message || "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResendingVerification(true)
    setError(null)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setMessage("Verification email resent. Please check your inbox.")
    } catch (error) {
      console.error("Error resending verification email:", error)
      setError("Failed to resend verification email. Please try again.")
    } finally {
      setIsResendingVerification(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isLogin ? "Sign in to your account" : "Create a new account"}
        </h2>
        {error && (
          <div
            className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            {error.includes("Email link is invalid or has expired") && (
              <button
                onClick={handleResendVerification}
                disabled={isResendingVerification}
                className="mt-2 text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                {isResendingVerification ? "Resending..." : "Resend verification email"}
              </button>
            )}
          </div>
        )}
        {message && (
          <div
            className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleAuth}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-md hover:bg-zinc-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : isLogin ? "Sign in" : "Sign up"}
          </button>
        </form>
        <div className="mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError(null)
              setMessage(null)
              setPassword("")
              setConfirmPassword("")
            }}
            className="w-full text-center text-sm text-zinc-400 hover:text-white"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}

