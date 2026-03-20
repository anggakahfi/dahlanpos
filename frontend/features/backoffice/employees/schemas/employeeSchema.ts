import { z } from "zod"

export const employeeSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.enum(["owner", "cashier"]),
  outlet_id: z.string().nullable(),
  status: z.enum(["active", "inactive"]),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>
