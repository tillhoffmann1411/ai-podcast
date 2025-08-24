"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PlayerProps {
    title: string
    audioUrl: string
    cityName: string
    code: string
}

export function Player({ title, audioUrl, cityName, code }: PlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [previousVolume, setPreviousVolume] = useState(1)
    const audioRef = useRef<HTMLAudioElement>(null)

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
        if (newVolume > 0) {
            setIsMuted(false)
        }
    }

    const toggleMute = () => {
        const audio = audioRef.current
        if (!audio) return

        if (isMuted) {
            audio.volume = previousVolume
            setVolume(previousVolume)
            setIsMuted(false)
        } else {
            setPreviousVolume(volume)
            audio.volume = 0
            setVolume(0)
            setIsMuted(true)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 z-50 backdrop-blur-md">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Progress Bar at the very top */}
            <div className="w-full h-1 bg-gray-700 hover:h-2 transition-all duration-200 group cursor-pointer relative">
                <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-100 group-hover:from-green-300 group-hover:to-green-400 pointer-events-none"
                    style={{ width: `${progress}%` }}
                />
                <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="absolute inset-0 w-full h-full [&>span]:opacity-0 hover:[&>span]:opacity-100 [&>span]:transition-opacity [&>span]:bg-green-400"
                />
            </div>

            {/* Main Player Content */}
            <div className="px-4 py-4">
                <div className="flex items-center justify-between max-w-screen-xl mx-auto">
                    {/* Track Info */}
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">🏛️</span>
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-white font-semibold text-sm truncate">{title}</h4>
                            <div className="flex items-center space-x-2">
                                <p className="text-gray-400 text-xs truncate">{cityName}</p>
                                <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5">
                                    {code}
                                </Badge>
                            </div>
                        </div>
                        {/* Time Display */}
                        <div className="flex flex-col items-center space-x-2 text-xs text-gray-400 font-mono min-w-0 justify-end md:flex-row">
                            <span>{formatTime(currentTime)}</span>
                            <span className="hidden md:block">/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Volume Controls (Desktop only) */}
                        <div className="hidden md:flex items-center space-x-3 min-w-0 w-32">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMute}
                                className="text-gray-400 hover:text-white p-2 flex-shrink-0"
                            >
                                {isMuted ? (
                                    <VolumeX className="h-4 w-4" />
                                ) : (
                                    <Volume2 className="h-4 w-4" />
                                )}
                            </Button>
                            <div className="flex-1 min-w-0">
                                <Slider
                                    value={[isMuted ? 0 : volume]}
                                    max={1}
                                    step={0.1}
                                    onValueChange={handleVolumeChange}
                                    className="w-full"
                                />
                            </div>
                        </div>



                        {/* Play/Pause Button */}
                        <div className="flex items-center justify-center px-6">
                            <Button
                                onClick={togglePlayPause}
                                className="w-12 h-12 rounded-full bg-white hover:bg-gray-200 text-black flex items-center justify-center transition-all duration-200 transform hover:scale-105"
                            >
                                {isPlaying ? (
                                    <Pause className="h-5 w-5" />
                                ) : (
                                    <Play className="h-5 w-5 ml-0.5" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
