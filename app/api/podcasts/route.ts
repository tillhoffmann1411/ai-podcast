import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 })
    }

    const { data: podcasts, error } = await supabase
      .from("podcasts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50) // Limit to recent 50 podcasts

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch podcasts" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      podcasts: podcasts || [],
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
