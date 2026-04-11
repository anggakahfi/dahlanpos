"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/backoffice/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings, useUpdateSettings } from "@/features/backoffice/settings/hooks/useSettings"
import { toast } from "sonner"

export default function TaxSettingsPage() {
  const { data: settings, isLoading } = useSettings()
  const updateMutation = useUpdateSettings()

  const [taxEnabled, setTaxEnabled] = useState(true)
  const [taxRate, setTaxRate] = useState("11")
  const [taxName, setTaxName] = useState("PPN 11%")
  const [taxType, setTaxType] = useState<"inclusive" | "exclusive">("exclusive")

  useEffect(() => {
    if (settings?.tax) {
      setTaxEnabled(settings.tax.enabled)
      setTaxRate(settings.tax.rate.toString())
      setTaxName(settings.tax.name || "")
      setTaxType((settings.tax.type as "inclusive" | "exclusive") || "exclusive")
    }
  }, [settings])

  const handleSave = async () => {
    if (!settings) return
    try {
      await updateMutation.mutateAsync({
        ...settings,
        tax: {
          enabled: taxEnabled,
          rate: parseFloat(taxRate) || 0,
          name: taxName,
          type: taxType,
        },
      })
      toast.success("Tax settings saved successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to save tax settings")
    }
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Tax Configuration" />
        <div className="p-6">Loading settings...</div>
      </>
    )
  }

  const price = 100000
  const tax = (price * parseInt(taxRate)) / 100
  const totalExclusive = price + tax
  const totalInclusive = price
  const taxFromInclusive = price - price / (1 + parseInt(taxRate) / 100)

  return (
    <>
      <PageHeader title="Tax Configuration" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tax Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Enable Tax</p>
                    <p className="text-sm text-muted-foreground">
                      Add tax to every transaction
                    </p>
                  </div>
                  <Switch checked={taxEnabled} onCheckedChange={setTaxEnabled} />
                </div>

                {taxEnabled && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="taxRate">Tax Rate (%)</FieldLabel>
                      <Input
                        id="taxRate"
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        min="0"
                        max="100"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="taxName">Tax Name</FieldLabel>
                      <Input
                        id="taxName"
                        value={taxName}
                        onChange={(e) => setTaxName(e.target.value)}
                        placeholder='e.g., "PPN 11%"'
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Tax Type</FieldLabel>
                      <RadioGroup
                        value={taxType}
                        onValueChange={(v) => setTaxType(v as "inclusive" | "exclusive")}
                        className="space-y-4"
                      >
                        <div
                          className={cn(
                            "flex cursor-pointer items-start gap-4 rounded-lg border p-4",
                            taxType === "inclusive" && "border-primary bg-primary/5"
                          )}
                          onClick={() => setTaxType("inclusive")}
                        >
                          <RadioGroupItem value="inclusive" id="inclusive" />
                          <div>
                            <Label htmlFor="inclusive" className="cursor-pointer font-semibold">
                              Include in Price
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Tax is already included in the displayed price. The system will calculate tax from gross sales.
                            </p>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "flex cursor-pointer items-start gap-4 rounded-lg border p-4",
                            taxType === "exclusive" && "border-primary bg-primary/5"
                          )}
                          onClick={() => setTaxType("exclusive")}
                        >
                          <RadioGroupItem value="exclusive" id="exclusive" />
                          <div>
                            <Label htmlFor="exclusive" className="cursor-pointer font-semibold">
                              Add to Total
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Tax is added on top of the subtotal at checkout.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </Field>

                    {/* Example Calculation */}
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <p className="mb-2 font-medium">Example Calculation</p>
                        {taxType === "exclusive" ? (
                          <div className="space-y-1 text-sm">
                            <p>Product Price: Rp {price.toLocaleString()}</p>
                            <p>+ Tax ({taxRate}%): Rp {tax.toLocaleString()}</p>
                            <p className="font-bold">
                              Total: Rp {totalExclusive.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1 text-sm">
                            <p>Product Price (incl. tax): Rp {price.toLocaleString()}</p>
                            <p>Tax portion ({taxRate}%): Rp {Math.round(taxFromInclusive).toLocaleString()}</p>
                            <p className="font-bold">
                              Customer Pays: Rp {totalInclusive.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </FieldGroup>

              <Button
                className="mt-6 w-full"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
