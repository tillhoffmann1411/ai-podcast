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
import { Label } from './ui/label'

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
              <Label htmlFor="city">
                Enter City Name
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="e.g., Paris, Tokyo, New York..."
                value={cityName}
                onChange={(e) => handleCityChange(e.target.value)}
                className="text-lg py-6 bg-input border-border focus:ring-ring"
                disabled={isGenerating}
              />
            </div>

            {/* Advanced Options - Slide in when city is entered */}
            {showAdvancedOptions && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Language Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="language">
                      Language
                    </Label>
                    <Select value={language} onValueChange={setLanguage} disabled={isGenerating}>
                      <SelectTrigger className="py-6 bg-input border-border">
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
                    <Label htmlFor="length">
                      Duration: {length[0]} minutes
                    </Label>
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
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Generation Result */}
      {result && (
        <Card className="bg-gradient-to-r from-violet-50 to-cyan-50 dark:from-violet-950/20 dark:to-cyan-950/20 border-violet-200 dark:border-violet-800 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
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
  )
}
