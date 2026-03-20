import {
  Receipt,
  Package,
  BarChart3,
  Store,
  Users,
  Settings,
} from "lucide-react"

const features = [
  {
    title: "Manajemen Transaksi",
    description:
      "Proses transaksi dengan cepat dan mudah. Dukung pembayaran tunai dan QRIS.",
    icon: Receipt,
  },
  {
    title: "Manajemen Stok",
    description:
      "Pantau stok barang secara real-time dengan notifikasi stok menipis.",
    icon: Package,
  },
  {
    title: "Laporan Bisnis",
    description:
      "Analisis penjualan dengan laporan harian, mingguan, dan bulanan.",
    icon: BarChart3,
  },
  {
    title: "Multi-Outlet",
    description:
      "Kelola beberapa outlet dari satu dashboard yang terintegrasi.",
    icon: Store,
  },
  {
    title: "Manajemen Karyawan",
    description:
      "Atur akses karyawan dan pantau aktivitas shift mereka.",
    icon: Users,
  },
  {
    title: "Kustomisasi Menu",
    description:
      "Tambahkan modifier dan varian untuk produk Anda dengan mudah.",
    icon: Settings,
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Semua yang Anda Butuhkan
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Fitur lengkap untuk mengelola bisnis F&B Anda dari mana saja
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
