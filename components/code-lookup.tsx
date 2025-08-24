"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Search, ExternalLink, Lock } from "lucide-react"
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

  const handleCodeChange = (value: string) => {
    setCode(value.toUpperCase())
    setError("")
  }

  const handleComplete = (value: string) => {
    if (value.length === 6) {
      handleLookup()
    }
  }

  return (
    <Card className="max-w-lg mx-auto border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-heading text-2xl font-bold">Access Your Podcast</CardTitle>
        <p className="font-body text-muted-foreground">Enter your 6-character access code</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={handleCodeChange}
            onComplete={handleComplete}
            disabled={loading}
            inputMode="text"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-12 text-xl font-mono" />
              <InputOTPSlot index={1} className="w-12 h-12 text-xl font-mono" />
              <InputOTPSlot index={2} className="w-12 h-12 text-xl font-mono" />
              <InputOTPSlot index={3} className="w-12 h-12 text-xl font-mono" />
              <InputOTPSlot index={4} className="w-12 h-12 text-xl font-mono" />
              <InputOTPSlot index={5} className="w-12 h-12 text-xl font-mono" />
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleLookup}
            disabled={loading || code.length !== 6}
            className="w-full py-6 text-lg font-medium bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white shadow-lg transition-all duration-200"
          >
            {loading ? (
              <>
                <Search className="h-5 w-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <ExternalLink className="h-5 w-5 mr-2" />
                Access Podcast
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive text-center font-medium">{error}</p>
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Codes contain only letters and numbers (case-insensitive)
          </p>
          <p className="text-xs text-muted-foreground">
            Example: <span className="font-mono bg-muted px-1 rounded">ABC123</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
