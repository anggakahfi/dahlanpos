"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PageHeader } from "@/components/backoffice/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Pencil, Trash2, AlertTriangle, X, Star, Image as ImageIcon } from "lucide-react"
import { uploadImage } from "@/lib/api"
import { useItems, useCreateItem, useUpdateItem, useDeleteItem } from "@/features/backoffice/items/hooks/useItems"
import { useCategories } from "@/features/backoffice/categories/hooks/useCategories"
import { useModifiers } from "@/features/backoffice/modifiers/hooks/useModifiers"
import { itemSchema, type ItemFormData } from "@/features/backoffice/items/schemas/itemSchema"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  // ─── TanStack Query ─────────────────────────────
  const { data: itemsRes, isLoading, isError } = useItems()
  const { data: categoryList = [] } = useCategories()
  const { data: modifierList = [] } = useModifiers()
  const productList = itemsRes?.data || []
  const createMutation = useCreateItem()
  const updateMutation = useUpdateItem()
  const deleteMutation = useDeleteItem()

  // ─── React Hook Form + Zod ──────────────────────
  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      category_id: "",
      price: 0,
      stock: 0,
      unit: "cup",
      low_stock_threshold: 10,
      description: "",
      modifier_group_ids: [],
      is_active: true,
      image_url: "",
    },
  })

  const filteredProducts = productList.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (categoryFilter !== "all" && p.category_name !== categoryFilter) return false
    if (stockFilter === "low" && p.stock >= p.low_stock_threshold) return false
    if (stockFilter === "out" && p.stock > 0) return false
    return true
  })

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setSelectedModifiers(product.modifier_group_ids || [])
    form.reset({
      name: product.name,
      category_id: product.category_id || "",
      price: product.price,
      stock: product.stock,
      unit: product.unit || "cup",
      low_stock_threshold: product.low_stock_threshold || 10,
      description: product.description || "",
      modifier_group_ids: product.modifier_group_ids || [],
      is_active: product.is_active,
      image_url: product.image_url || "",
    })
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setSelectedModifiers([])
    form.reset({
      name: "",
      category_id: categoryList[0]?.id || "",
      price: 0,
      stock: 0,
      unit: "cup",
      low_stock_threshold: 10,
      description: "",
      modifier_group_ids: [],
      is_active: true,
      image_url: "",
    })
    setIsModalOpen(true)
  }

  const onSubmit = async (data: ItemFormData) => {
    const payload = { ...data, modifier_group_ids: selectedModifiers }
    console.log("[SUBMIT ITEM]", { editing: !!editingProduct, payload })
    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      toast.success("Item berhasil disimpan")
      setIsModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan item")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Item berhasil dihapus")
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus item")
    }
  }

  const toggleModifier = (id: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return "out"
    if (product.stock < product.low_stock_threshold) return "low"
    return "normal"
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const url = await uploadImage(file)
      form.setValue("image_url", url)
      toast.success("Gambar berhasil diunggah")
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah gambar")
    } finally {
      setIsUploading(false)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending || isUploading

  if (isLoading) {
    return (
      <>
        <PageHeader title="Items" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Memuat daftar item...</p>
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <PageHeader title="Items" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">Gagal memuat item. Pastikan backend berjalan.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Items">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Item
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryList.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product)
            return (
              <Card
                key={product.id}
                className={cn(
                  "relative overflow-hidden",
                  stockStatus === "out" && "opacity-60"
                )}
              >
                {product.is_favorite && (
                  <div className="absolute right-2 top-2 z-10">
                    <Star className="h-5 w-5 fill-[#F59E0B] text-[#F59E0B]" />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="line-clamp-2 text-base font-semibold">{product.name}</h3>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {product.category_name}
                  </Badge>
                  <p className="mt-2 text-lg font-bold">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {stockStatus === "out" ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-[#EF4444]">
                        <X className="h-4 w-4" /> Out of Stock
                      </span>
                    ) : stockStatus === "low" ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-[#F59E0B]">
                        <AlertTriangle className="h-4 w-4" /> {product.stock} {product.unit}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {product.stock} {product.unit}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(product)}>
                      <Pencil className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => setDeleteTarget(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Create/Edit Modal — React Hook Form + Zod */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>
              {editingProduct ? "Edit Item" : "Create New Item"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] px-6 py-4">
            <form id="item-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Item Name</FieldLabel>
                  <Input id="name" placeholder="Enter item name" {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select
                    value={form.watch("category_id") || undefined}
                    onValueChange={(v) => form.setValue("category_id", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryList.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category_id && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.category_id.message}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="price">Price (Rp)</FieldLabel>
                  <Input id="price" type="number" placeholder="25000" {...form.register("price", { valueAsNumber: true })} />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.price.message}</p>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="stock">Stock Quantity</FieldLabel>
                    <Input id="stock" type="number" placeholder="50" {...form.register("stock", { valueAsNumber: true })} />
                    {form.formState.errors.stock && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.stock.message}</p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="unit">Unit</FieldLabel>
                    <Select
                      value={form.watch("unit") || undefined}
                      onValueChange={(v) => form.setValue("unit", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">pcs</SelectItem>
                        <SelectItem value="cup">cup</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="liter">liter</SelectItem>
                        <SelectItem value="porsi">porsi</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="lowStock">Low Stock Threshold</FieldLabel>
                  <Input id="lowStock" type="number" placeholder="10" {...form.register("low_stock_threshold", { valueAsNumber: true })} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
                  <Textarea id="description" placeholder="Enter item description" rows={3} {...form.register("description")} />
                </Field>

                <Field>
                  <FieldLabel>Photo</FieldLabel>
                  <div className="flex items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-muted">
                      {form.watch("image_url") ? (
                        <img src={form.watch("image_url")} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Input 
                        type="file" 
                        id="photo-upload" 
                        className="hidden" 
                        accept="image/jpeg, image/png" 
                        onChange={handleFileUpload} 
                        disabled={isUploading}
                      />
                      <Button type="button" variant="outline" asChild disabled={isUploading}>
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          {isUploading ? "Uploading..." : "Upload Photo"}
                        </label>
                      </Button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Max 2MB, JPG or PNG</p>
                </Field>

                <Field>
                  <FieldLabel>Applicable Modifiers</FieldLabel>
                  <div className="space-y-3 rounded-lg border p-4">
                    {modifierList.map((group) => (
                      <div key={group.id} className="flex items-center gap-3">
                        <Checkbox
                          id={`modifier-${group.id}`}
                          checked={selectedModifiers.includes(group.id)}
                          onCheckedChange={() => toggleModifier(group.id)}
                        />
                        <label htmlFor={`modifier-${group.id}`} className="cursor-pointer text-sm">
                          {group.name}
                          <span className="ml-2 text-muted-foreground">
                            ({group.options.length} options)
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </Field>
              </FieldGroup>
            </form>
          </ScrollArea>
          <DialogFooter className="border-t px-6 py-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" form="item-form" disabled={isSaving}>
              {isSaving ? "Saving..." : (editingProduct ? "Save Changes" : "Create Item")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Item"
        description={`Apakah Anda yakin ingin menghapus item "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
