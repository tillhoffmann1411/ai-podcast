import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Home } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>

          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Podcast Not Found</h1>

          <p className="font-body text-muted-foreground mb-6">
            The podcast code you entered doesn't exist or may have been removed. Please check the code and try again.
          </p>

          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
