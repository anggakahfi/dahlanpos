"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { loginOAuth } from "@/lib/api"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleOAuthLogin = async (idToken: string) => {
    setIsLoading(true)
    setError("")
    try {
      const result = await loginOAuth(idToken)
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

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "112899621345-lfles6vamavj2ouc3b6todsidq6jgivn.apps.googleusercontent.com"
  const isDevMode = false

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
            {isDevMode && (
              <div className="space-y-2 mb-2 p-3 bg-muted rounded-md border border-dashed">
                <p className="text-xs text-muted-foreground mb-2 text-center text-orange-600 font-semibold">
                  ⚠️ DEV MODE ACTIVE (Real OAuth Disabled)
                </p>
                <input
                  type="email"
                  placeholder="owner@smallthings.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleOAuthLogin(email)}
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleOAuthLogin(email)}
                  disabled={isLoading}
                >
                  {isLoading ? "Masuk..." : "Simulasi Login"}
                </Button>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded-md">
                {error}
              </p>
            )}
            
            {isLoading ? (
              <Button disabled className="w-full h-12 text-base font-medium">
                Memvalidasi Identitas...
              </Button>
            ) : !isDevMode && (
              <div className="flex justify-center w-full">
                <GoogleOAuthProvider clientId={clientId}>
                  <GoogleLogin
                    onSuccess={async (credentialResponse: any) => {
                      if (credentialResponse.credential) {
                        await handleOAuthLogin(credentialResponse.credential);
                      }
                    }}
                    onError={() => {
                      setError("Otentikasi Google gagal atau dibatalkan.");
                    }}
                    useOneTap
                    shape="rectangular"
                    theme="outline"
                    width="100%"
                  />
                </GoogleOAuthProvider>
              </div>
            )}
            
            <p className="text-xs text-center text-muted-foreground mt-4 px-4 leading-relaxed">
              Silakan login dengan akun admin/kasir yang telah ditugaskan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
