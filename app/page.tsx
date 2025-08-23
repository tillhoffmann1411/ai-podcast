import { PodcastGenerator } from "@/components/podcast-generator"
import { PodcastGallery } from "@/components/podcast-gallery"
import { CodeLookup } from "@/components/code-lookup"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl font-bold text-foreground mb-6">Discover Your City's History</h1>
          <p className="font-body text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Generate AI-powered podcasts that bring your city's fascinating history to life. Enter any city name and get
            a unique podcast in minutes.
          </p>

          {/* Podcast Generator Form */}
          <PodcastGenerator />
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <CodeLookup />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Recently Generated Podcasts</h2>
          <PodcastGallery />
        </div>
      </section>
    </main>
  )
}
