export interface PodcastGenerationRequest {
  city_name: string
}

export interface PodcastGenerationResponse {
  success: boolean
  code?: string
  id?: string
  error?: string
}

export interface PodcastsResponse {
  success: boolean
  podcasts?: Array<{
    id: string
    code: string
    city_name: string
    title?: string
    description?: string
    audio_url?: string
    script_content?: string
    status: string
    error_message?: string
    created_at: string
    updated_at: string
  }>
  error?: string
}

export interface PodcastResponse {
  success: boolean
  podcast?: {
    id: string
    code: string
    city_name: string
    title?: string
    description?: string
    audio_url?: string
    script_content?: string
    status: string
    error_message?: string
    created_at: string
    updated_at: string
  }
  error?: string
}

export async function generatePodcast(cityName: string): Promise<PodcastGenerationResponse> {
  const response = await fetch("/api/generate-podcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ city_name: cityName }),
  })

  return response.json()
}

export async function fetchPodcasts(): Promise<PodcastsResponse> {
  const response = await fetch("/api/podcasts")
  return response.json()
}

export async function fetchPodcastByCode(code: string): Promise<PodcastResponse> {
  const response = await fetch(`/api/podcasts/${code}`)
  return response.json()
}
