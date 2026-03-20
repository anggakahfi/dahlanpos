import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#10B981]" />
          <span className="text-muted-foreground">
            Trusted by 50+ UMKM F&B di Indonesia
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          POS Modern untuk
          <br />
          <span className="text-primary">Bisnis F&B Anda</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          Kelola transaksi, stok, dan laporan bisnis dengan mudah. 
          DahlanPOS dirancang khusus untuk UMKM F&B di Indonesia.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8 text-base font-semibold">
              Coba Gratis 14 Hari
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold"
            >
              <Play className="mr-2 h-4 w-4" />
              Lihat Demo
            </Button>
          </Link>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 rounded-xl border-2 border-dashed border-border bg-muted/50 p-8">
          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-background">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  DP
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Dashboard Preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
