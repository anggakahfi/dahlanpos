"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PageHeader } from "@/components/backoffice/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/features/backoffice/categories/hooks/useCategories"
import { categorySchema, type CategoryFormData } from "@/features/backoffice/categories/schemas/categorySchema"
import type { Category } from "@/lib/types"

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // ─── TanStack Query ─────────────────────────────
  const { data: categoryList = [], isLoading, isError } = useCategories()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  // ─── React Hook Form + Zod ──────────────────────
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  })

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    form.reset({ name: category.name })
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    form.reset({ name: "" })
    setIsModalOpen(true)
  }

  const onSubmit = async (data: CategoryFormData) => {
    console.log("[SUBMIT CATEGORY]", { editing: !!editingCategory, data })
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory.id, name: data.name })
      } else {
        await createMutation.mutateAsync(data.name)
      }
      setIsModalOpen(false)
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan kategori")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return
    try {
      await deleteMutation.mutateAsync(id)
    } catch (err: any) {
      alert(err.message || "Gagal menghapus kategori")
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  if (isLoading) {
    return (
      <>
        <PageHeader title="Categories" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Memuat kategori...</p>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Categories" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Gagal memuat kategori. Pastikan backend berjalan.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Categories">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        <Card className="max-w-2xl">
          <CardContent className="p-0">
            <ul className="divide-y">
              {categoryList.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.itemCount} items
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="categoryName">Category Name</FieldLabel>
                <Input
                  id="categoryName"
                  placeholder="Enter category name"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : (editingCategory ? "Save" : "Add")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
