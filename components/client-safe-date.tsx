"use client"

import { useEffect, useState } from "react"

interface ClientSafeDateProps {
    dateString: string
    format: "short" | "long"
}

export function ClientSafeDate({ dateString, format }: ClientSafeDateProps) {
    const [formattedDate, setFormattedDate] = useState<string>("")
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)

        const date = new Date(dateString)

        const options: Intl.DateTimeFormatOptions = format === "long"
            ? {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }
            : {
                month: "short",
                day: "numeric",
                year: "numeric",
            }

        // Use the user's actual timezone on the client
        setFormattedDate(new Intl.DateTimeFormat("en-US", options).format(date))
    }, [dateString, format])

    // Return a simple fallback during SSR
    if (!isClient) {
        const date = new Date(dateString)
        return (
            <span suppressHydrationWarning>
                {format === "long"
                    ? date.toISOString().split('T')[0] // Simple YYYY-MM-DD format
                    : date.toISOString().split('T')[0]
                }
            </span>
        )
    }

    return <span>{formattedDate}</span>
}
