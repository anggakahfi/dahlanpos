"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PageHeader } from "@/components/backoffice/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Plus, Pencil, Users, MapPin, Phone } from "lucide-react"
import { useOutlets, useCreateOutlet, useUpdateOutlet } from "@/features/backoffice/outlets/hooks/useOutlets"
import { outletSchema, type OutletFormData } from "@/features/backoffice/outlets/schemas/outletSchema"
import type { Outlet } from "@/lib/types"

export default function OutletsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null)

  // ─── TanStack Query (Server State) ──────────────
  const { data: outletList = [], isLoading, isError } = useOutlets()
  const createMutation = useCreateOutlet()
  const updateMutation = useUpdateOutlet()

  // ─── React Hook Form + Zod ──────────────────────
  const form = useForm<OutletFormData>({
    resolver: zodResolver(outletSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      open_time: "07:00",
      close_time: "22:00",
      status: "active",
    },
  })

  const handleEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet)
    form.reset({
      name: outlet.name,
      address: outlet.address,
      phone: outlet.phone,
      email: outlet.email || "",
      open_time: outlet.open_time || "07:00",
      close_time: outlet.close_time || "22:00",
      status: outlet.status as "active" | "inactive",
    })
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingOutlet(null)
    form.reset({
      name: "",
      address: "",
      phone: "",
      email: "",
      open_time: "07:00",
      close_time: "22:00",
      status: "active",
    })
    setIsModalOpen(true)
  }

  const onSubmit = async (data: OutletFormData) => {
    console.log("[SUBMIT OUTLET]", { editing: !!editingOutlet, data })
    try {
      if (editingOutlet) {
        await updateMutation.mutateAsync({ id: editingOutlet.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      setIsModalOpen(false)
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan outlet")
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  // ─── Loading & Error Fallback ────────────────────
  if (isLoading) {
    return (
      <>
        <PageHeader title="Outlets" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Memuat daftar outlet...</p>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Outlets" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Gagal memuat outlet. Pastikan backend berjalan.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Outlets">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Outlet
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {outletList.map((outlet) => (
            <Card key={outlet.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{outlet.name}</CardTitle>
                  <Badge
                    variant={outlet.status === "active" ? "default" : "secondary"}
                    className={
                      outlet.status === "active"
                        ? "bg-[#10B981] hover:bg-[#10B981]/80"
                        : ""
                    }
                  >
                    {outlet.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{outlet.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{outlet.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary">
                      {outlet.employee_count || 0} employees
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(outlet)}
                  >
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <div className="flex items-center gap-2 rounded-md border px-3">
                    <span className="text-xs text-muted-foreground">Active</span>
                    <Switch checked={outlet.status === "active"} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal — React Hook Form + Zod */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOutlet ? "Edit Outlet" : "Add New Outlet"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="outletName">Outlet Name</FieldLabel>
                <Input
                  id="outletName"
                  placeholder="e.g., KopaKopi Central"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Textarea
                  id="address"
                  placeholder="Full address"
                  rows={3}
                  {...form.register("address")}
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.address.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="021-xxxxxxxx"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.phone.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email (Optional)</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="outlet@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="openTime">Open Time</FieldLabel>
                  <Input
                    id="openTime"
                    type="time"
                    {...form.register("open_time")}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="closeTime">Close Time</FieldLabel>
                  <Input
                    id="closeTime"
                    type="time"
                    {...form.register("close_time")}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Active Status</p>
                  <p className="text-sm text-muted-foreground">
                    Outlet is open for business
                  </p>
                </div>
                <Switch
                  checked={form.watch("status") === "active"}
                  onCheckedChange={(checked) =>
                    form.setValue("status", checked ? "active" : "inactive")
                  }
                />
              </div>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : (editingOutlet ? "Save Changes" : "Add Outlet")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
