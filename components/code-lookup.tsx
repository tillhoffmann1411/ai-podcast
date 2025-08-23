"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ExternalLink } from "lucide-react"
import { validatePodcastCode, formatPodcastCode } from "@/lib/code-utils"
import { useRouter } from 'next/navigation'

export function CodeLookup() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLookup = async () => {
    const formattedCode = formatPodcastCode(code)

    if (!validatePodcastCode(formattedCode)) {
      setError("Please enter a valid 6-character code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/podcast/${formattedCode}`)
      const data = await response.json()

      if (data.success && data.podcast) {
        // Redirect to podcast page
        router.push(`/podcast/${formattedCode}`)
      } else {
        setError("Podcast not found. Please check your code and try again.")
      }
    } catch (err) {
      setError("Failed to lookup podcast. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLookup()
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-xl">Find Your Podcast</CardTitle>
        <p className="font-body text-sm text-muted-foreground">Enter your 6-character code to access your podcast</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="ABC123"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={handleKeyPress}
            maxLength={6}
            className="font-mono text-center text-lg tracking-wider"
          />
          <Button
            onClick={handleLookup}
            disabled={loading || code.length !== 6}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? <Search className="h-4 w-4 animate-pulse" /> : <ExternalLink className="h-4 w-4" />}
          </Button>
        </div>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        <p className="text-xs text-muted-foreground text-center">
          Codes are case-insensitive and contain only letters and numbers
        </p>
      </CardContent>
    </Card>
  )
}
