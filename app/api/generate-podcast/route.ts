import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateUniqueCode } from "@/lib/code-utils"

function generatePodcastCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const { city_name, language, length } = await request.json()

    if (!city_name || typeof city_name !== "string") {
      return NextResponse.json({ success: false, error: "City name is required" }, { status: 400 })
    }

    if (!language || typeof language !== "string") {
      return NextResponse.json({ success: false, error: "Language is required" }, { status: 400 })
    }

    if (!length || typeof length !== "number" || length < 2 || length > 15) {
      return NextResponse.json({ success: false, error: "Length must be between 2 and 15 minutes" }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 })
    }

    const code = await generateUniqueCode(supabase)

    generatePodcastAsync(city_name.trim(), language, length, code)

    return NextResponse.json({
      success: true,
      code: code,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

async function generatePodcastAsync(
  cityName: string,
  language: string,
  length: number,
  code: string,
) {
  try {
    const webhookResponse = await fetch("https://n8n.till-hoffmann.me/webhook/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          location: cityName,
          language: language,
          length: length,
          code: code,
        },
      ]),
    })

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed with status: ${webhookResponse.status}`)
    }

    const webhookResult = await webhookResponse.json()
    return webhookResult;
  } catch (error) {
    console.error("Generation error:", error)
    return { success: false, error: "Failed to generate podcast" }
  }
}
