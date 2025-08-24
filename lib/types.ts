export interface Podcast {
  id: string
  code: string
  city_name: string
  title?: string
  description?: string
  audio_url?: string
  script_content?: string
  status: "pending" | "generating" | "completed" | "failed"
  error_message?: string
  created_at: string
  updated_at: string
  length: number
  language: "English" | "German"
  references: {
    url: string,
    date: string,
    title: string,
    last_updated: string,
  }[]
}

export interface PodcastGenerationRequest {
  city_name: string
}

export interface PodcastGenerationResponse {
  success: boolean
  code?: string
  error?: string
}
