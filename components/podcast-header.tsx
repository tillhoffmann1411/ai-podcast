"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Download, Share2, Copy } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ClientSafeDate } from "@/components/client-safe-date"

interface PodcastHeaderProps {
    podcast: {
        status: string
        audio_url?: string
        city_name: string
        title?: string
        code: string
        created_at: string
        description?: string
    }
}

export function PodcastHeader({ podcast }: PodcastHeaderProps) {
    const { toast } = useToast()

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



    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast({
            title: "🔗 Link Copied",
            description: "Podcast link copied to clipboard",
        })
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(podcast.code)
        toast({
            title: "🔗 Code Copied",
            description: "Podcast code copied to clipboard",
        })
    }

    const handleDownload = () => {
        if (podcast.audio_url) {
            const link = document.createElement('a')
            link.href = podcast.audio_url
            link.download = `${podcast.city_name}-history-podcast.mp3`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast({
                title: "⬇️ Download Started",
                description: "Your podcast is being downloaded",
            })
        }
    }

    return (
        <header className="border-b border-border bg-card/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="outline" size="sm" className="bg-transparent border-border hover:bg-muted">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                        {podcast.status !== "completed" && (
                            <Badge className={`${getStatusColor(podcast.status)} shadow-lg font-medium px-3 py-1`}>
                                {getStatusIcon(podcast.status)} {podcast.status}
                            </Badge>
                        )}
                    </div>

                    {podcast.status === "completed" && podcast.audio_url && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShare}
                                className="bg-transparent border-border hover:bg-muted"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                                className="bg-transparent border-border hover:bg-muted"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {podcast.title || `The History of ${podcast.city_name}`}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-body">{podcast.city_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-body">
                                <ClientSafeDate dateString={podcast.created_at} format="long" />
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopyCode} className="bg-transparent border-border hover:bg-muted">
                                <Copy className="h-4 w-4 mr-2" />
                                {podcast.code}
                            </Button>
                        </div>
                    </div>

                    {podcast.description && (
                        <p className="font-body text-lg text-muted-foreground max-w-3xl leading-relaxed">{podcast.description}</p>
                    )}
                </div>
            </div>
        </header>
    )
}
