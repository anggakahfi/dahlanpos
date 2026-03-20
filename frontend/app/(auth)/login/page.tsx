"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"
import { loginOAuth } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleOAuthLogin = async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await loginOAuth(email || "owner@smallthings.com")
      if (result.user.role === "owner") {
        router.push("/backoffice")
      } else {
        router.push("/cashier")
      }
    } catch (err: any) {
      setError(err.message || "Login gagal")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
            ST
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Small Things POS</CardTitle>
            <CardDescription className="pt-2">Masuk ke sistem kasir dan backoffice</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (dev mode)</Label>
              <Input
                id="email"
                type="email"
                placeholder="owner@smallthings.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button 
              variant="outline" 
              className="w-full h-12 text-base font-medium flex items-center justify-center gap-2" 
              onClick={handleOAuthLogin}
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Memvalidasi..." : "Masuk dengan Google"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4 px-4 leading-relaxed">
              Gunakan email yang didaftarkan oleh Owner. Dev mode: masukkan email langsung.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
