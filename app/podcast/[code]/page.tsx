import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { PodcastPlayer } from "@/components/podcast-player"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

interface PodcastPageProps {
  params: Promise<{
    code: string
  }>
}

async function getPodcast(code: string) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent text-accent-foreground"
      case "generating":
        return "bg-secondary text-secondary-foreground"
      case "pending":
        return "bg-muted text-muted-foreground"
      case "failed":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-transparent border-border hover:bg-muted">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Badge className={getStatusColor(podcast.status)}>{podcast.status}</Badge>
          </div>

          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-bold text-foreground">
              {podcast.title || `The History of ${podcast.city_name}`}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-body">{podcast.city_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-body">{formatDate(podcast.created_at)}</span>
              </div>
              <div className="font-mono text-sm font-medium">Code: {podcast.code}</div>
            </div>

            {podcast.description && (
              <p className="font-body text-lg text-muted-foreground max-w-3xl">{podcast.description}</p>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Podcast Player */}
          {podcast.status === "completed" && podcast.audio_url && (
            <Card>
              <CardContent className="p-8">
                <PodcastPlayer
                  title={podcast.title || `History of ${podcast.city_name}`}
                  audioUrl={podcast.audio_url}
                  cityName={podcast.city_name}
                />
              </CardContent>
            </Card>
          )}

          {/* Status Messages */}
          {podcast.status === "generating" && (
            <Card className="bg-secondary/5 border-secondary/20">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <div className="h-2 bg-secondary rounded-full w-3/4 mx-auto"></div>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">Generating Your Podcast</h3>
                  <p className="font-body text-muted-foreground">
                    Our AI is researching and creating your podcast about {podcast.city_name}. This usually takes a few
                    minutes.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {podcast.status === "pending" && (
            <Card className="bg-muted/50 border-muted">
              <CardContent className="p-8 text-center">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Podcast Queued</h3>
                <p className="font-body text-muted-foreground">
                  Your podcast about {podcast.city_name} is in the queue and will begin processing shortly.
                </p>
              </CardContent>
            </Card>
          )}

          {podcast.status === "failed" && (
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-8 text-center">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Generation Failed</h3>
                <p className="font-body text-muted-foreground">
                  {podcast.error_message || "There was an error generating your podcast. Please try again."}
                </p>
                <Link href="/" className="inline-block mt-4">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Generate New Podcast
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Script Content */}
          {podcast.status === "completed" && podcast.script_content && (
            <Card>
              <CardContent className="p-8">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Podcast Script</h2>
                <div className="prose prose-slate max-w-none">
                  <pre className="font-body text-foreground text-wrap">
                    {podcast.script_content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
