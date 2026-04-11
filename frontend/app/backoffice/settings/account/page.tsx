"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/backoffice/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { getStoredUser } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function AccountSettingsPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  if (!user) return null

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <>
      <PageHeader title="Profile Settings" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-lg space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Dimanage oleh Google Workspace</AlertTitle>
            <AlertDescription>
              Aplikasi DahlanPOS berintegrasi langsung secara aman dengan Google Sign-In terpusat. 
              Kata sandi (password) dan data privasi otentikasi lainnya sepenuhnya dilindungi oleh keamanan perangkat Google. Profil ini berstatus read-only.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informasi Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{user.role} Account</p>
                    </div>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <div className="rounded-lg border bg-muted/50 p-2.5 text-sm font-medium">
                    {user.name}
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="rounded-lg border bg-muted/50 p-2.5 text-sm font-medium">
                    {user.email}
                  </div>
                </Field>

                <Field>
                  <FieldLabel>System Role</FieldLabel>
                  <div className="rounded-lg border bg-muted/50 p-2.5 text-sm font-medium capitalize">
                    {user.role}
                  </div>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
