import { z } from "zod"

export const itemSchema = z.object({
  name: z.string().min(2, "Nama item minimal 2 karakter"),
  category_id: z.string().min(1, "Kategori wajib dipilih"),
  price: z.number({ coerce: true }).positive("Harga harus lebih dari 0"),
  stock: z.number({ coerce: true }).int().min(0, "Stok tidak boleh negatif"),
  unit: z.string().min(1, "Unit wajib dipilih"),
  low_stock_threshold: z.number({ coerce: true }).int().min(0).default(10),
  description: z.string().optional().default(""),
  modifier_group_ids: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
  image_url: z.string().optional(),
})

export type ItemFormData = z.infer<typeof itemSchema>
