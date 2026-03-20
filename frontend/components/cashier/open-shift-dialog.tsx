"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign } from "lucide-react"
import { useShift } from "./shift-context"

export function OpenShiftDialog() {
  const { openShift } = useShift()
  const [startingCash, setStartingCash] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenShift = async () => {
    const amount = parseFloat(startingCash) || 0
    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    openShift(amount)
    setIsLoading(false)
  }

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "")
    return number ? parseInt(number).toLocaleString("id-ID") : ""
  }

  return (
    <div className="flex items-center justify-center h-full bg-muted/30">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Buka Shift</CardTitle>
          <CardDescription>
            Masukkan jumlah uang kas awal untuk memulai shift Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="startingCash">Kas Awal</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                Rp
              </span>
              <Input
                id="startingCash"
                type="text"
                placeholder="0"
                value={formatCurrency(startingCash)}
                onChange={(e) => setStartingCash(e.target.value.replace(/\D/g, ""))}
                className="pl-10 text-right text-lg font-medium"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Hitung uang tunai di laci kas sebelum memulai
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Outlet</span>
              <span className="font-medium">Kopi Kenangan Sudirman</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Kasir</span>
              <span className="font-medium">Budi Santoso</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Waktu</span>
              <span className="font-medium">
                {new Date().toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          <Button 
            onClick={handleOpenShift} 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Membuka Shift..." : "Buka Shift"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
