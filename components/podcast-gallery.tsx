"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, Clock, ExternalLink, MapPin, Sparkles, AudioLines } from "lucide-react"
import type { Podcast } from "@/lib/types"
import { useRouter } from "next/navigation"
import { ClientSafeDate } from "@/components/client-safe-date"

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
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      case "generating":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
      case "pending":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "failed":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅"
      case "generating":
        return "⚡"
      case "pending":
        return "⏳"
      case "failed":
        return "❌"
      default:
        return "❓"
    }
  }



  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm animate-pulse">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gradient-to-r from-violet-200 to-cyan-200 dark:from-violet-800 dark:to-cyan-800 rounded-lg w-2/3"></div>
                <div className="h-6 w-16 bg-gradient-to-r from-violet-200 to-cyan-200 dark:from-violet-800 dark:to-cyan-800 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-violet-100 to-cyan-100 dark:from-violet-900 dark:to-cyan-900 rounded w-1/2"></div>
                <div className="h-3 bg-gradient-to-r from-violet-100 to-cyan-100 dark:from-violet-900 dark:to-cyan-900 rounded w-3/4"></div>
                <div className="h-10 bg-gradient-to-r from-violet-100 to-cyan-100 dark:from-violet-900 dark:to-cyan-900 rounded-lg w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-100 to-cyan-100 dark:from-violet-900/20 dark:to-cyan-900/20 rounded-full mb-6">
          <Sparkles className="h-10 w-10 text-violet-600" />
        </div>
        <h3 className="font-heading text-2xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
          No Podcasts Yet
        </h3>
        <p className="font-body text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Be the first to create an AI-generated historical podcast! Every city has amazing stories waiting to be discovered.
        </p>
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white shadow-lg"
        >
          <Mic className="mr-2 h-4 w-4" />
          Create First Podcast
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {podcasts.map((podcast) => (
        <Card
          key={podcast.id}
          className="group border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[0.99] cursor-pointer overflow-hidden"
          onClick={() => podcast.status === "completed" && router.push(`/podcast/${podcast.code}`)}
        >
          <CardContent className="p-0">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-violet-500 to-cyan-500 p-6 rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 dark:bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                    <AudioLines className="h-5 w-5 text-white" />
                  </div>
                  {podcast.status !== "completed" && (
                    <Badge className={`${getStatusColor(podcast.status)} shadow-lg font-medium px-3 py-1`}>
                      {getStatusIcon(podcast.status)} {podcast.status}
                    </Badge>
                  )}
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2 leading-tight">
                  {podcast.title || `History of ${podcast.city_name}`}
                </h3>
                <Badge variant="outline" className="flex items-center text-white/90">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{podcast.city_name}</span>
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>Created <ClientSafeDate dateString={podcast.created_at} format="short" /></span>
              </div>

              <div className="flex items-center justify-between">
                <div className="bg-muted/50 px-3 py-2 rounded-lg">
                  <span className="font-mono text-sm font-bold text-foreground">{podcast.code}</span>
                </div>

                {podcast.status === "generating" && (
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                    <span className="text-sm font-medium">Generating...</span>
                  </div>
                )}

                {podcast.status === "pending" && (
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <div className="animate-pulse rounded-full h-4 w-4 bg-current mr-2"></div>
                    <span className="text-sm font-medium">In Queue</span>
                  </div>
                )}

                {podcast.status === "failed" && (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <span className="text-sm font-medium">Generation Failed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-600/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
