"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PageHeader } from "@/components/backoffice/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { useEmployees, useCreateEmployee, useUpdateEmployee, useUpdateEmployeeStatus, useDeleteEmployee } from "@/features/backoffice/employees/hooks/useEmployees"
import { useOutlets } from "@/features/backoffice/outlets/hooks/useOutlets"
import { employeeSchema, type EmployeeFormData } from "@/features/backoffice/employees/schemas/employeeSchema"
import type { Employee, Outlet } from "@/lib/types"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [outletFilter, setOutletFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)

  // ─── TanStack Query ─────────────────────────────
  const { data: employeeList = [], isLoading, isError } = useEmployees()
  const { data: outletList = [] } = useOutlets()
  const createMutation = useCreateEmployee()
  const updateMutation = useUpdateEmployee()
  const statusMutation = useUpdateEmployeeStatus()
  const deleteMutation = useDeleteEmployee()

  // ─── React Hook Form + Zod ──────────────────────
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "cashier",
      outlet_id: null,
      status: "active",
    },
  })

  const selectedRole = form.watch("role")

  const filteredEmployees = employeeList.filter((e) => {
    if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()))
      return false
    if (outletFilter !== "all" && e.outlet_id !== outletFilter) return false
    if (roleFilter !== "all" && e.role !== roleFilter) return false
    if (statusFilter !== "all" && e.status !== statusFilter) return false
    return true
  })

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    form.reset({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      outlet_id: employee.outlet_id,
      status: employee.status,
    })
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingEmployee(null)
    form.reset({
      name: "",
      email: "",
      role: "cashier",
      outlet_id: null,
      status: "active",
    })
    setIsModalOpen(true)
  }

  const onSubmit = async (data: EmployeeFormData) => {
    console.log("[SUBMIT EMPLOYEE]", { editing: !!editingEmployee, data })
    if (data.role === "cashier" && !data.outlet_id) {
      toast.error("Pilih outlet untuk kasir")
      return
    }
    try {
      if (editingEmployee) {
        await updateMutation.mutateAsync({ id: editingEmployee.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      toast.success("Karyawan berhasil disimpan")
      setIsModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan karyawan")
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return (
      <>
        <PageHeader title="Employees" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Memuat data karyawan...</p>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Employees" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Gagal memuat karyawan. Pastikan backend berjalan.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Employees">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-9"
            />
          </div>

          <Select value={outletFilter} onValueChange={setOutletFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlets</SelectItem>
              {outletList.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      {employee.outlet_id ? (
                        <Badge variant="secondary" className="text-xs">
                          {outletList.find((o: Outlet) => o.id === employee.outlet_id)?.name.split(" ").pop() || "Unknown"}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.role === "owner" ? "default" : "secondary"}>
                        {employee.role === "owner" ? "Owner" : "Cashier"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={employee.status === "active"}
                        onCheckedChange={async (checked) => {
                          const newStatus = checked ? "active" : "inactive"
                          try {
                            await statusMutation.mutateAsync({ id: employee.id, status: newStatus })
                            toast.success("Status karyawan diperbarui")
                          } catch (e: any) {
                            toast.error(e.message || "Gagal mengubah status")
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(employee)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setDeleteTarget(employee)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Modal — React Hook Form + Zod */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" placeholder="Full name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="email@example.com" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Select
                  value={selectedRole}
                  onValueChange={(v) => form.setValue("role", v as "owner" | "cashier")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Assign to Outlet</FieldLabel>
                {selectedRole === "owner" ? (
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      Owners have access to all outlets. No specific assignment needed.
                    </p>
                  </div>
                ) : (
                  <Select
                    value={form.watch("outlet_id") ?? undefined}
                    onValueChange={(v) => form.setValue("outlet_id", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an outlet" />
                    </SelectTrigger>
                    <SelectContent>
                      {outletList.map((outlet) => (
                        <SelectItem key={outlet.id} value={outlet.id}>
                          {outlet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>

              {!editingEmployee && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Username and password will be auto-generated and sent to the employee email.
                  </p>
                </div>
              )}
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : (editingEmployee ? "Save Changes" : "Add Employee")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Karyawan"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        onConfirm={async () => {
          if (deleteTarget) {
            try {
              await deleteMutation.mutateAsync(deleteTarget.id)
              toast.success("Karyawan berhasil dihapus")
            } catch (e: any) {
              toast.error(e.message || "Gagal menghapus karyawan")
            }
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
