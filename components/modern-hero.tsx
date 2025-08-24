"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, Mic, Copy, ExternalLink, Sparkles, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GenerationResult {
    code: string
    city_name: string
    status: string
}

export function ModernHero() {
    const [cityName, setCityName] = useState("")
    const [language, setLanguage] = useState<string>("")
    const [length, setLength] = useState<number[]>([6])
    const [isGenerating, setIsGenerating] = useState(false)
    const [result, setResult] = useState<GenerationResult | null>(null)
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
    const { toast } = useToast()

    const handleCityChange = (value: string) => {
        setCityName(value)
        if (value.trim() && !showAdvancedOptions) {
            setShowAdvancedOptions(true)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!cityName.trim() || !language) return

        setIsGenerating(true)
        setResult(null)

        try {
            const response = await fetch("/api/generate-podcast", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    city_name: cityName.trim(),
                    language: language,
                    length: length[0],
                }),
            })

            const data = await response.json()

            if (data.success) {
                setResult({
                    code: data.code,
                    city_name: cityName.trim(),
                    status: "generating",
                })
                toast({
                    title: "🎧 Podcast Generation Started",
                    description: `Your ${length[0]}-minute podcast about ${cityName} is being created!`,
                })
            } else {
                toast({
                    title: "Generation Failed",
                    description: data.error || "Failed to start podcast generation",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to connect to the server",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const copyCode = () => {
        if (result?.code) {
            navigator.clipboard.writeText(result.code)
            toast({
                title: "✅ Code Copied",
                description: "Podcast code copied to clipboard",
            })
        }
    }

    const openPodcast = () => {
        if (result?.code) {
            window.open(`/podcast/${result.code}`, "_blank")
        }
    }

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-violet-950/20 dark:via-background dark:to-cyan-950/20" />
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-violet-200/30 dark:bg-violet-500/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-200/30 dark:bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto space-y-12">
                    {/* Hero Text */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
                            <Sparkles className="h-4 w-4" />
                            AI-Powered Historical Storytelling
                        </div>

                        <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent leading-tight">
                            Discover Your City's
                            <br />
                            <span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                                Hidden Stories
                            </span>
                        </h1>

                        <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Transform any city into an immersive audio journey. Our AI crafts personalized podcasts that bring history to life in minutes.
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="max-w-2xl mx-auto">
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* City Input */}
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Enter any city name... (e.g., Paris, Tokyo, New York)"
                                            value={cityName}
                                            onChange={(e) => handleCityChange(e.target.value)}
                                            className="py-7 pl-12 pr-4 bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                            disabled={isGenerating}
                                        />
                                    </div>
                                </div>

                                {/* Advanced Options - Slide in when city is entered */}
                                {showAdvancedOptions && (
                                    <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Language Selection */}
                                            <div className="space-y-2">
                                                <label className="font-body text-sm font-medium text-foreground">
                                                    Language
                                                </label>
                                                <Select value={language} onValueChange={setLanguage} disabled={isGenerating}>
                                                    <SelectTrigger className="py-6 bg-background/50 border-border/50">
                                                        <SelectValue placeholder="Choose language..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="English">🇺🇸 English</SelectItem>
                                                        <SelectItem value="German">🇩🇪 German</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Length Selection */}
                                            <div className="space-y-3">
                                                <label className="font-body text-sm font-medium text-foreground">
                                                    Duration: {length[0]} minutes
                                                </label>
                                                <div className="px-2">
                                                    <Slider
                                                        value={length}
                                                        onValueChange={setLength}
                                                        max={15}
                                                        min={2}
                                                        step={1}
                                                        className="w-full"
                                                        disabled={isGenerating}
                                                    />
                                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                        <span>2 min</span>
                                                        <span>15 min</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Generate Button */}
                                        <Button
                                            type="submit"
                                            disabled={isGenerating || !cityName.trim() || !language}
                                            className="w-full py-7 text-lg font-medium bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Creating Your Podcast...
                                                </>
                                            ) : (
                                                <>
                                                    <Mic className="mr-2 h-5 w-5" />
                                                    Generate AI Podcast
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Generation Result */}
                    {result && (
                        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-violet-50 to-cyan-50 dark:from-violet-950/20 dark:to-cyan-950/20 border-violet-200 dark:border-violet-800 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
                            <CardContent className="p-8 text-center">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full mb-4">
                                        <Mic className="h-10 w-10 text-white" />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-heading text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                                            🎉 Podcast Created!
                                        </h3>
                                        <p className="font-body text-lg text-muted-foreground">
                                            Your podcast about <strong>{result.city_name}</strong> is being generated
                                        </p>
                                    </div>

                                    <div className="bg-white/80 dark:bg-background/80 backdrop-blur-sm border border-violet-200 dark:border-violet-800 rounded-xl p-6 max-w-sm mx-auto">
                                        <p className="font-body text-sm text-muted-foreground mb-3">Your unique access code:</p>
                                        <div className="font-mono text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent tracking-wider">
                                            {result.code}
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-md mx-auto">
                                        <p className="text-amber-800 dark:text-amber-200 text-sm">
                                            ⏱️ Generation typically takes 1-5 minutes. You'll be able to listen once it's ready!
                                        </p>
                                    </div>

                                    <div className="flex gap-4 justify-center">
                                        <Button
                                            onClick={copyCode}
                                            variant="outline"
                                            className="border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/20 bg-white/80 dark:bg-background/80"
                                        >
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy Code
                                        </Button>

                                        <Button
                                            onClick={openPodcast}
                                            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white shadow-lg"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Check Status
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </section>
    )
}
