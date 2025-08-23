import type { SupabaseClient } from "@supabase/supabase-js"

export function generatePodcastCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function generateUniqueCode(supabase: SupabaseClient, maxRetries = 10): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const code = generatePodcastCode()

    // Check if code already exists
    const { data: existing } = await supabase.from("podcasts").select("id").eq("code", code).single()

    if (!existing) {
      return code
    }
  }

  // If we've exhausted retries, throw an error
  throw new Error("Unable to generate unique code after maximum retries")
}

export function validatePodcastCode(code: string): boolean {
  if (!code || typeof code !== "string") return false
  if (code.length !== 6) return false

  const validChars = /^[A-Z0-9]+$/
  return validChars.test(code)
}

export function formatPodcastCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "")
}
