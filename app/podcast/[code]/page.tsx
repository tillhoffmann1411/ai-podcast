import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Player } from "@/components/player"
import { PodcastHeader } from "@/components/podcast-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Podcast } from '../../../lib/types'

interface PodcastPageProps {
  params: Promise<{
    code: string
  }>
}

async function getPodcast(code: string): Promise<Podcast | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const { data: podcast, error } = await supabase.from("podcasts").select("*").eq("code", code.toUpperCase()).single()

  if (error || !podcast) return null
  return podcast
}

export default async function PodcastPage({ params }: PodcastPageProps) {
  const { code } = await params
  const podcast = await getPodcast(code)

  if (!podcast) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <PodcastHeader podcast={podcast} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Status Messages */}
          {podcast.status === "generating" && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Generating Your Podcast
                  </h3>
                  <p className="font-body text-lg text-muted-foreground">
                    Our AI is researching and creating your podcast about <strong>{podcast.city_name}</strong>. This usually takes 1-5 minutes.
                  </p>
                  <div className="bg-white/80 dark:bg-background/80 rounded-lg p-4 max-w-md mx-auto">
                    <div className="animate-pulse">
                      <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full w-3/4 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {podcast.status === "pending" && (
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Podcast Queued
                  </h3>
                  <p className="font-body text-lg text-muted-foreground">
                    Your podcast about <strong>{podcast.city_name}</strong> is in the queue and will begin processing shortly.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {podcast.status === "failed" && (
            <Card className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-200 dark:border-red-800 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full mb-4">
                    <span className="text-2xl">❌</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    Generation Failed
                  </h3>
                  <p className="font-body text-lg text-muted-foreground mb-6">
                    {podcast.error_message || "There was an error generating your podcast. Please try again."}
                  </p>
                  <Link href="/" className="inline-block">
                    <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white shadow-lg">
                      Generate New Podcast
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Script Content */}
          {podcast.status === "completed" && podcast.script_content && (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 space-y-8 md:p-8">
                <div>
                  <h2 className="font-heading text-3xl font-bold mb-6">
                    📜<span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">Podcast Script</span>
                  </h2>
                  <pre className="font-body text-foreground text-wrap whitespace-pre-wrap leading-relaxed">
                    {podcast.script_content}
                  </pre>
                </div>

                <div>
                  <h2 className="font-heading text-3xl font-bold mb-6">
                    📜<span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent"> References</span>
                  </h2>
                  <ul className="list-disc list-inside">
                    {podcast.references.map((reference, index) => (
                      <li key={index}>
                        <Link href={reference.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {reference.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {reference.date} - Last updated: {reference.last_updated}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Spotify-style Player - Only show when audio is available */}
      {podcast.status === "completed" && podcast.audio_url && (
        <Player
          title={podcast.title || `History of ${podcast.city_name}`}
          audioUrl={podcast.audio_url}
          cityName={podcast.city_name}
          code={podcast.code}
        />
      )}
    </main>
  )
}
