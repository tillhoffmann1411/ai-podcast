import { ModernHero } from "@/components/modern-hero"
import { PodcastGallery } from "@/components/podcast-gallery"
import { CodeLookup } from "@/components/code-lookup"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Modern Hero Section */}
      <ModernHero />

      {/* Explanation Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Our advanced AI analyzes historical data, local archives, and cultural insights to create engaging,
            personalized podcasts about any city's rich history. From ancient origins to modern developments,
            discover the stories that shaped your favorite places.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="font-heading text-xl font-semibold">Enter City</h3>
              <p className="text-muted-foreground">Simply type in any city name worldwide</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="font-heading text-xl font-semibold">AI Generation</h3>
              <p className="text-muted-foreground">Our AI researches and creates your custom podcast</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="font-heading text-xl font-semibold">Listen & Share</h3>
              <p className="text-muted-foreground">Enjoy your personalized historical journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Lookup Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Already Have a Code?
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Enter your 6-character podcast code to access your generated content
            </p>
          </div>
          <CodeLookup />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl font-bold text-center mb-4">Recently Generated Podcasts</h2>
          <p className="font-body text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Explore what others have discovered about cities around the world
          </p>
          <PodcastGallery />
        </div>
      </section>
    </main>
  )
}
