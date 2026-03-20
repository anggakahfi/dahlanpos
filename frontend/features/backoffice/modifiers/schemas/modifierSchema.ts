import { z } from "zod"

const modifierOptionSchema = z.object({
  name: z.string().min(1, "Nama opsi wajib diisi"),
  price_impact: z.number({ coerce: true }).default(0),
})

export const modifierSchema = z.object({
  name: z.string().min(2, "Nama modifier minimal 2 karakter"),
  required: z.boolean().default(false),
  options: z.array(modifierOptionSchema).min(1, "Minimal 1 opsi"),
})

export type ModifierFormData = z.infer<typeof modifierSchema>
