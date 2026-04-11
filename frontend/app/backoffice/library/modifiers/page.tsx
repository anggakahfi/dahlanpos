"use client"

import { useState } from "react"
import { PageHeader } from "@/components/backoffice/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { useModifiers, useCreateModifier, useUpdateModifier, useDeleteModifier } from "@/features/backoffice/modifiers/hooks/useModifiers"
import type { ModifierGroup, ModifierOption } from "@/lib/types"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"

export default function ModifiersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingModifier, setEditingModifier] = useState<ModifierGroup | null>(null)
  const [modifierName, setModifierName] = useState("")
  const [options, setOptions] = useState<ModifierOption[]>([])
  const [isRequired, setIsRequired] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ModifierGroup | null>(null)

  // ─── TanStack Query ─────────────────────────────
  const { data: modifierList = [], isLoading, isError } = useModifiers()
  const createMutation = useCreateModifier()
  const updateMutation = useUpdateModifier()
  const deleteMutation = useDeleteModifier()

  const handleEdit = (modifier: ModifierGroup) => {
    setEditingModifier(modifier)
    setModifierName(modifier.name)
    setOptions(modifier.options)
    setIsRequired(modifier.required)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingModifier(null)
    setModifierName("")
    setOptions([{ name: "", price_impact: 0 }])
    setIsRequired(false)
    setIsModalOpen(true)
  }

  const addOption = () => {
    setOptions([...options, { name: "", price_impact: 0 }])
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, field: keyof ModifierOption, value: string | number) => {
    const newOptions = [...options]
    if (field === "price_impact") {
      newOptions[index][field] = Number(value)
    } else {
      newOptions[index][field] = value as string
    }
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      name: modifierName,
      required: isRequired,
      options: options.map((opt) => ({
        name: opt.name,
        price_impact: opt.price_impact,
      })),
    }
    console.log("[SUBMIT MODIFIER]", { editing: !!editingModifier, data })
    try {
      if (editingModifier) {
        await updateMutation.mutateAsync({ id: editingModifier.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      toast.success("Modifier berhasil disimpan")
      setIsModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan modifier")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Modifier berhasil dihapus")
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus modifier")
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return (
      <>
        <PageHeader title="Modifiers" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Memuat modifier...</p>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Modifiers" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Gagal memuat modifier. Pastikan backend berjalan.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Modifiers">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Modifier
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Set Name</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Used By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modifierList.map((modifier) => (
                  <TableRow key={modifier.id}>
                    <TableCell className="font-medium">{modifier.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {modifier.options.slice(0, 3).map((opt, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {opt.name}
                            {opt.price_impact > 0 && ` +Rp ${opt.price_impact.toLocaleString('id-ID')}`}
                          </Badge>
                        ))}
                        {modifier.options.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{modifier.options.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={modifier.required ? "default" : "secondary"}>
                        {modifier.required ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>{modifier.usedByCount} items</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(modifier)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setDeleteTarget(modifier)}
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

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingModifier ? "Edit Modifier Set" : "Create Modifier Set"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="setName">Set Name</FieldLabel>
                <Input
                  id="setName"
                  placeholder='e.g., "Size"'
                  value={modifierName}
                  onChange={(e) => setModifierName(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Options</FieldLabel>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Option name"
                        value={option.name}
                        onChange={(e) => updateOption(index, "name", e.target.value)}
                        required
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Price +/-"
                        value={option.price_impact}
                        onChange={(e) => updateOption(index, "price_impact", e.target.value)}
                        className="w-32"
                      />
                      {options.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          className="h-10 w-10 shrink-0 text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addOption} className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> Add Option
                  </Button>
                </div>
              </Field>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Required</p>
                  <p className="text-sm text-muted-foreground">
                    Customer must select an option
                  </p>
                </div>
                <Switch checked={isRequired} onCheckedChange={setIsRequired} />
              </div>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : (editingModifier ? "Save Changes" : "Create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Modifier"
        description={`Apakah Anda yakin ingin menghapus modifier "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
