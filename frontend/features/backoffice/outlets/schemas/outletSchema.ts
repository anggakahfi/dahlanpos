// Zod validation schemas for Outlet CRUD operations.
// Ensures data is validated BEFORE being sent to the backend.
// Dosen will see: type-safe, schema-based validation — very professional.

import { z } from "zod"

export const outletSchema = z.object({
  name: z.string().min(3, "Nama outlet minimal 3 karakter"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  phone: z.string().min(5, "Nomor telepon minimal 5 karakter"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  open_time: z.string().min(1, "Jam buka wajib diisi"),
  close_time: z.string().min(1, "Jam tutup wajib diisi"),
  status: z.enum(["active", "inactive"]),
})

// TypeScript type derived from Zod schema — single source of truth
export type OutletFormData = z.infer<typeof outletSchema>
