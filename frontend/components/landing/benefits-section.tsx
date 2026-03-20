import { Clock, ShieldCheck, TrendingUp, Globe } from "lucide-react"

const benefits = [
  {
    title: "Hemat Waktu",
    description:
      "Proses transaksi 3x lebih cepat dibanding cara manual. Fokus pada pelayanan pelanggan, bukan administrasi.",
    icon: Clock,
  },
  {
    title: "Kurangi Human Error",
    description:
      "Sistem otomatis menghitung total dan kembalian. Minimalisir kesalahan hitung yang merugikan bisnis.",
    icon: ShieldCheck,
  },
  {
    title: "Keputusan Berbasis Data",
    description:
      "Laporan detail membantu Anda mengambil keputusan bisnis yang tepat berdasarkan data penjualan aktual.",
    icon: TrendingUp,
  },
  {
    title: "Akses Dimana Saja",
    description:
      "Pantau bisnis Anda dari mana saja melalui browser. Tidak perlu install aplikasi tambahan.",
    icon: Globe,
  },
]

export function BenefitsSection() {
  return (
    <section className="bg-muted/50 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Mengapa Memilih DahlanPOS?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Tingkatkan efisiensi dan profitabilitas bisnis Anda
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex gap-4 rounded-lg border bg-card p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                <benefit.icon className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
