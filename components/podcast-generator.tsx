"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, Mic, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GenerationResult {
  code: string
  city_name: string
  status: string
}

export function PodcastGenerator() {
  const [cityName, setCityName] = useState("")
  const [language, setLanguage] = useState<string>("")
  const [length, setLength] = useState<number[]>([6])
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const { toast } = useToast()

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
          title: "Podcast Generation Started",
          description: `Your ${length[0]}-minute podcast about ${cityName} in ${language} is being generated.`,
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
        title: "Code Copied",
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
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Generation Form */}
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="city" className="font-body text-sm font-medium text-foreground">
                Enter City Name
              </label>
              <Input
                id="city"
                type="text"
                placeholder="e.g., Paris, Tokyo, New York..."
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="text-lg py-6 bg-input border-border focus:ring-ring"
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="language" className="font-body text-sm font-medium text-foreground">
                Select Language
              </label>
              <Select value={language} onValueChange={setLanguage} disabled={isGenerating}>
                <SelectTrigger className="text-lg py-6 bg-input border-border">
                  <SelectValue placeholder="Choose language..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label htmlFor="length" className="font-body text-sm font-medium text-foreground">
                Podcast Length: {length[0]} minutes
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

            <Button
              type="submit"
              disabled={isGenerating || !cityName.trim() || !language}
              className="w-full py-6 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Podcast...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-5 w-5" />
                  Generate Podcast
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generation Result */}
      {result && (
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <Mic className="h-8 w-8 text-accent" />
              </div>

              <h3 className="font-heading text-2xl font-bold text-foreground">Podcast Generated!</h3>

              <p className="font-body text-muted-foreground">
                Your podcast about <strong>{result.city_name}</strong> is ready
              </p>

              <div className="bg-background border border-border rounded-lg p-4 max-w-sm mx-auto">
                <p className="font-body text-sm text-muted-foreground mb-2">Your unique code:</p>
                <div className="font-mono text-2xl font-bold text-foreground tracking-wider">{result.code}</div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={copyCode} variant="outline" className="border-border hover:bg-muted bg-transparent">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </Button>

                <Button onClick={openPodcast} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Listen Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
