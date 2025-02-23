"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User, Session } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const checkUserRole = useCallback((user: User) => {
    console.log("Checking user role for user:", user.id)
    console.log("User metadata:", user.user_metadata)
    return user.user_metadata?.role === "admin" ? "admin" : "user"
  }, [])

  useEffect(() => {
    const getSession = async () => {
      console.log("Getting session...")
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error) {
        console.error("Error fetching session:", error)
      } else {
        console.log("Session retrieved:", session)
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    try {
      console.log("Signing out...")
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      console.log("Sign out successful, redirecting to auth page...")
      router.push("/auth")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return { user, session, loading, signOut }
}

