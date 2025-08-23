import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const { code } = params

    if (!code || code.length !== 6) {
      return NextResponse.json({ success: false, error: "Invalid podcast code" }, { status: 400 })
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
      podcast: {
        id: podcast.id,
        code: podcast.code,
        city_name: podcast.city_name,
        title: podcast.title,
        description: podcast.description,
        audio_url: podcast.audio_url,
        script_content: podcast.script_content,
        status: podcast.status,
        error_message: podcast.error_message,
        created_at: podcast.created_at,
        updated_at: podcast.updated_at,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
