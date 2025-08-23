"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, Clock, ExternalLink } from "lucide-react"
import type { Podcast } from "@/lib/types"
import { useRouter } from "next/navigation"

export function PodcastGallery() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchPodcasts()
  }, [])

  const fetchPodcasts = async () => {
    try {
      const response = await fetch("/api/podcasts")
      const data = await response.json()
      setPodcasts(data.podcasts || [])
    } catch (error) {
      console.error("Failed to fetch podcasts:", error)
    } finally {
      setLoading(false)
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-3 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-12">
        <Mic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="font-body text-muted-foreground">No podcasts generated yet. Be the first to create one!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {podcasts.map((podcast) => (
        <Card key={podcast.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  {podcast.title || `History of ${podcast.city_name}`}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-3">{podcast.city_name}</p>
              </div>
              <Badge className={getStatusColor(podcast.status)}>{podcast.status}</Badge>
            </div>

            <div className="flex items-center text-xs text-muted-foreground mb-4">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(podcast.created_at)}
            </div>

            <div className="flex items-center justify-between">
              <div className="font-mono text-sm font-medium text-foreground">{podcast.code}</div>

              {podcast.status === "completed" && (
                <Button
                  size="sm"
                  onClick={() => router.push(`/podcast/${podcast.code}`)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Listen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
