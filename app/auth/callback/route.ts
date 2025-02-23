import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      // Redirect to auth page with error
      return NextResponse.redirect(
        `${requestUrl.origin}/auth?error=access_denied&error_description=${encodeURIComponent((error as Error).message)}`,
      )
    }
  }

  // Redirect to the dashboard or home page after successful authentication
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}

