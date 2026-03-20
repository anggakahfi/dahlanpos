"use client"

import { useState } from "react"
import { PageHeader } from "@/components/backoffice/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Upload, Image as ImageIcon } from "lucide-react"

export default function ReceiptSettingsPage() {
  const [headerText, setHeaderText] = useState("")
  const [footerMessage, setFooterMessage] = useState("Terima kasih!")
  const [showTax, setShowTax] = useState(true)

  return (
    <>
      <PageHeader title="Receipt Template" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customize Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>Upload Logo</FieldLabel>
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Max 1MB, PNG or JPG, 200x200px recommended
                  </p>
                </Field>

                <Field>
                  <FieldLabel>Outlet Info</FieldLabel>
                  <div className="rounded-lg border bg-muted/50 p-4 text-sm">
                    <p className="font-medium">KopaKopi Central</p>
                    <p className="text-muted-foreground">
                      Jl. Sudirman No. 123, Jakarta Pusat
                    </p>
                    <p className="text-muted-foreground">021-12345678</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This info is pulled from your outlet settings
                  </p>
                </Field>

                <Field>
                  <FieldLabel htmlFor="headerText">
                    Header Text (Optional)
                  </FieldLabel>
                  <Input
                    id="headerText"
                    placeholder="e.g., Best Coffee in Town!"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    maxLength={50}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Max 50 characters
                  </p>
                </Field>

                <Field>
                  <FieldLabel htmlFor="footerMessage">Footer Message</FieldLabel>
                  <Textarea
                    id="footerMessage"
                    placeholder="Thank you message"
                    value={footerMessage}
                    onChange={(e) => setFooterMessage(e.target.value)}
                    rows={2}
                  />
                </Field>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Show Tax Breakdown</p>
                    <p className="text-sm text-muted-foreground">
                      Display tax calculation on receipt
                    </p>
                  </div>
                  <Switch checked={showTax} onCheckedChange={setShowTax} />
                </div>
              </FieldGroup>

              <Button className="mt-6 w-full">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-auto w-64 rounded-lg border bg-card p-4 font-mono text-xs shadow-sm">
                {/* Logo Placeholder */}
                <div className="mb-3 flex h-12 items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
                    DP
                  </div>
                </div>

                {/* Outlet Info */}
                <div className="mb-3 text-center">
                  <p className="font-bold">KopaKopi Central</p>
                  <p className="text-muted-foreground">
                    Jl. Sudirman No. 123, Jakarta
                  </p>
                  <p className="text-muted-foreground">021-12345678</p>
                </div>

                {headerText && (
                  <p className="mb-3 text-center text-muted-foreground">
                    {headerText}
                  </p>
                )}

                <Separator className="my-2" />

                {/* Order Info */}
                <div className="mb-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Order ID</span>
                    <span>ORD-20250308-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>08/03/2025 14:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cashier</span>
                    <span>Ojan</span>
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Items */}
                <div className="mb-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Americano M Ice</span>
                    <span>2 x 30.000</span>
                  </div>
                  <div className="pl-2 text-muted-foreground">Less Sugar</div>
                  <div className="flex justify-between">
                    <span>Croissant</span>
                    <span>1 x 25.000</span>
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Summary */}
                <div className="mb-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp 85.000</span>
                  </div>
                  {showTax && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (11%)</span>
                      <span>Rp 9.350</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rp 94.350</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment</span>
                    <span>QRIS</span>
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Footer */}
                <p className="text-center text-muted-foreground">{footerMessage}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
