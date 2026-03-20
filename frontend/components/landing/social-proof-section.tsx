const logos = [
  "Kopi Kenangan",
  "Janji Jiwa",
  "Fore Coffee",
  "Kopi Soe",
  "Tomoro Coffee",
  "Point Coffee",
]

export function SocialProofSection() {
  return (
    <section className="bg-background px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Dipercaya oleh 50+ UMKM F&B
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <div
              key={logo}
              className="flex h-12 items-center justify-center px-4"
            >
              <div className="rounded border bg-muted px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {logo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
