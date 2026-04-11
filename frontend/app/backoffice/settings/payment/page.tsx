"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/backoffice/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Banknote, QrCode } from "lucide-react"
import { useSettings, useUpdateSettings } from "@/features/backoffice/settings/hooks/useSettings"
import { toast } from "sonner"

export default function PaymentSettingsPage() {
  const { data: settings, isLoading: isFetching } = useSettings()
  const updateMutation = useUpdateSettings()
  const [qrisEnabled, setQrisEnabled] = useState(true)

  useEffect(() => {
    if (settings?.payment) {
      setQrisEnabled(settings.payment.qris_enabled)
    }
  }, [settings])

  const handleSave = async () => {
    if (!settings) return
    try {
      await updateMutation.mutateAsync({
        ...settings,
        payment: {
          ...settings.payment,
          qris_enabled: qrisEnabled,
        },
      })
      toast.success("Payment settings saved successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to save payment settings")
    }
  }

  if (isFetching) {
    return (
      <>
        <PageHeader title="Metode Pembayaran" />
        <div className="p-6">Loading settings...</div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Metode Pembayaran" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Cash Payment */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981]/10">
                    <Banknote className="h-5 w-5 text-[#10B981]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Pembayaran Tunai</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Terima pembayaran dengan uang tunai
                    </p>
                  </div>
                </div>
                <Switch checked disabled />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pembayaran tunai selalu aktif dan tidak dapat dinonaktifkan.
              </p>
            </CardContent>
          </Card>

          {/* QRIS Manual */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Pencatatan QRIS</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Izinkan kasir mencatat transaksi yang dibayar via QRIS
                    </p>
                  </div>
                </div>
                <Switch checked={qrisEnabled} onCheckedChange={setQrisEnabled} />
              </div>
            </CardHeader>
            {qrisEnabled && (
              <CardContent>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Catatan:</strong> Fitur ini hanya berfungsi sebagai alat pencatatan di dalam sistem POS Small Things Coffee. Anda (Owner) harus menyediakan kode QRIS secara fisik (di-print) di meja kasir. Kasir wajib memastikan pelanggan telah berhasil transfer sebelum menyelesaikan transaksi di POS.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
