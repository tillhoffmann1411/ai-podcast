"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, Download, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PodcastPlayerProps {
  title: string
  audioUrl: string
  cityName: string
}

export function PodcastPlayer({ title, audioUrl, cityName }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = value[0]
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0]
    audio.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Podcast link copied to clipboard",
    })
  }

  const handleDownload = () => {
    // In a real implementation, this would trigger a download
    toast({
      title: "Download Started",
      description: "Your podcast is being downloaded",
    })
  }

  return (
    <div className="space-y-6">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Player Header */}
      <div className="text-center space-y-2">
        <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} className="w-full" />
        <div className="flex justify-between text-sm text-muted-foreground font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={togglePlayPause}
          size="lg"
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
        </Button>
      </div>

      {/* Volume and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-32">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider value={[volume]} max={1} step={0.1} onValueChange={handleVolumeChange} className="flex-1" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="bg-transparent border-border hover:bg-muted"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="bg-transparent border-border hover:bg-muted"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
