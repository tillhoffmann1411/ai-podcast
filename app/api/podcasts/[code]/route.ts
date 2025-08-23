import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const { code } = params

    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "Podcast code is required" }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 })
    }

    const { data: podcast, error } = await supabase.from("podcasts").select("*").eq("code", code.toUpperCase()).single()

    if (error || !podcast) {
      return NextResponse.json({ success: false, error: "Podcast not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      podcast,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
