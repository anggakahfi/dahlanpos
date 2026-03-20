"use client"

import { useState } from "react"
import { PageHeader } from "@/components/backoffice/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Upload, Eye, EyeOff, Check, X } from "lucide-react"

export default function AccountSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")

  const passwordRequirements = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "Contains a number", met: /\d/.test(newPassword) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
  ]

  return (
    <>
      <PageHeader title="Account Settings" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-lg">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="profile" className="flex-1">
                Profile
              </TabsTrigger>
              <TabsTrigger value="password" className="flex-1">
                Change Password
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Profile Photo</FieldLabel>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-24 w-24">
                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                              AD
                            </AvatarFallback>
                          </Avatar>
                          <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Photo
                          </Button>
                        </div>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                        <Input
                          id="fullName"
                          defaultValue="Ahmad Dahlan"
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="ahmad@kopakopi.com"
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="phone">Phone</FieldLabel>
                        <Input
                          id="phone"
                          type="tel"
                          defaultValue="08123456789"
                          required
                        />
                      </Field>

                      <Button type="submit" className="w-full">
                        Save Changes
                      </Button>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="currentPassword">
                          Current Password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="confirmPassword">
                          Confirm New Password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </Field>

                      {/* Password Requirements */}
                      <div className="rounded-lg border p-4">
                        <p className="mb-2 text-sm font-medium">
                          Password Requirements
                        </p>
                        <ul className="space-y-1">
                          {passwordRequirements.map((req) => (
                            <li
                              key={req.label}
                              className={`flex items-center gap-2 text-sm ${
                                req.met ? "text-[#10B981]" : "text-muted-foreground"
                              }`}
                            >
                              {req.met ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                              {req.label}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button type="submit" className="w-full">
                        Change Password
                      </Button>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
