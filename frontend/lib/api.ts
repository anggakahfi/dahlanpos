// API Client — centralized HTTP layer for communicating with the Go backend.
// All methods return typed data using the standardized API envelope:
// { success: true, data: T, meta?: { page, per_page, total, total_pages } }
// { success: false, error: { code: string, message: string } }

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// ─── Token Management ────────────────────────────────────────
let authToken: string | null = null

export function setAuthToken(token: string) {
  authToken = token
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('auth_token')
  }
  return authToken
}

export function clearAuthToken() {
  authToken = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
}

// ─── Core Fetch Wrapper ──────────────────────────────────────
interface APIResponse<T> {
  success: boolean
  data?: T
  meta?: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  error?: {
    code: string
    message: string
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  }

  const res = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
    ...options,
    headers,
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || `API Error: ${res.status}`)
  }

  return json
}

// ─── Auth ─────────────────────────────────────────────────────
export async function loginOAuth(email: string) {
  const res = await apiFetch<{
    token: string
    expires_at: string
    user: {
      id: string
      name: string
      email: string
      role: 'owner' | 'cashier'
      outlet_id?: string
    }
  }>('/api/v1/auth/login/oauth', {
    method: 'POST',
    body: JSON.stringify({ provider: 'google', id_token: email }),
  })
  if (res.data) {
    setAuthToken(res.data.token)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(res.data.user))
    }
  }
  return res.data!
}

export async function logout() {
  try {
    await apiFetch('/api/v1/auth/logout', { method: 'POST' })
  } finally {
    clearAuthToken()
  }
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('auth_user')
  return raw ? JSON.parse(raw) : null
}

// ─── Cashier ──────────────────────────────────────────────────
export async function getCashierMenu() {
  const res = await apiFetch<{
    categories: any[]
    items: any[]
    modifier_groups: any[]
  }>('/api/v1/cashier/menu')
  return res.data!
}

export async function openShift(outletId: string, startingCash: number) {
  const res = await apiFetch<any>('/api/v1/cashier/shifts/open', {
    method: 'POST',
    body: JSON.stringify({ outlet_id: outletId, starting_cash: startingCash }),
  })
  return res.data!
}

export async function getCurrentShift() {
  const res = await apiFetch<any>('/api/v1/cashier/shifts/current')
  return res.data
}

export async function closeShift(shiftId: string, endingCash: number, note: string) {
  const res = await apiFetch<any>('/api/v1/cashier/shifts/close', {
    method: 'POST',
    body: JSON.stringify({ shift_id: shiftId, ending_cash: endingCash, discrepancy_note: note }),
  })
  return res.data!
}

export async function createTransaction(payload: {
  shift_id: string
  outlet_id: string
  customer_name?: string
  payment_method: 'cash' | 'qris'
  items: {
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
    modifiers: { group_name: string; selected_option: string; price_impact: number }[]
  }[]
}) {
  const res = await apiFetch<any>('/api/v1/cashier/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return res.data!
}

export async function voidTransaction(id: string) {
  const res = await apiFetch<any>(`/api/v1/cashier/transactions/${id}/void`, {
    method: 'POST',
  })
  return res.data!
}

export async function getCashierTransactions(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await apiFetch<any[]>(`/api/v1/cashier/transactions${query}`)
  return { data: res.data!, meta: res.meta }
}

// ─── Backoffice: Categories ────────────────────────────────────
export async function getCategories() {
  const res = await apiFetch<any[]>('/api/v1/backoffice/categories')
  return res.data!
}

export async function createCategory(name: string) {
  const res = await apiFetch<any>('/api/v1/backoffice/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return res.data!
}

export async function updateCategory(id: string, name: string) {
  const res = await apiFetch<any>(`/api/v1/backoffice/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  })
  return res.data!
}

export async function deleteCategory(id: string) {
  await apiFetch(`/api/v1/backoffice/categories/${id}`, { method: 'DELETE' })
}

// ─── Backoffice: Products ──────────────────────────────────────
export async function getProducts(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await apiFetch<any[]>(`/api/v1/backoffice/products${query}`)
  return { data: res.data!, meta: res.meta }
}

export async function createProduct(product: any) {
  const res = await apiFetch<any>('/api/v1/backoffice/products', {
    method: 'POST',
    body: JSON.stringify(product),
  })
  return res.data!
}

export async function updateProduct(id: string, product: any) {
  const res = await apiFetch<any>(`/api/v1/backoffice/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
  return res.data!
}

export async function updateProductStock(id: string, stock: number) {
  await apiFetch(`/api/v1/backoffice/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ stock }),
  })
}

export async function deleteProduct(id: string) {
  await apiFetch(`/api/v1/backoffice/products/${id}`, { method: 'DELETE' })
}

// ─── Backoffice: Modifiers ─────────────────────────────────────
export async function getModifierGroups() {
  const res = await apiFetch<any[]>('/api/v1/backoffice/modifier-groups')
  return res.data!
}

export async function createModifierGroup(group: any) {
  const res = await apiFetch<any>('/api/v1/backoffice/modifier-groups', {
    method: 'POST',
    body: JSON.stringify(group),
  })
  return res.data!
}

export async function updateModifierGroup(id: string, group: any) {
  const res = await apiFetch<any>(`/api/v1/backoffice/modifier-groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(group),
  })
  return res.data!
}

export async function deleteModifierGroup(id: string) {
  await apiFetch(`/api/v1/backoffice/modifier-groups/${id}`, { method: 'DELETE' })
}

// ─── Backoffice: Employees ─────────────────────────────────────
export async function getEmployees() {
  const res = await apiFetch<any[]>('/api/v1/backoffice/employees')
  return res.data!
}

export async function createEmployee(emp: any) {
  const res = await apiFetch<any>('/api/v1/backoffice/employees', {
    method: 'POST',
    body: JSON.stringify(emp),
  })
  return res.data!
}

export async function updateEmployee(id: string, emp: any) {
  const res = await apiFetch<any>(`/api/v1/backoffice/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(emp),
  })
  return res.data!
}

export async function updateEmployeeStatus(id: string, status: 'active' | 'inactive') {
  await apiFetch(`/api/v1/backoffice/employees/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function deleteEmployee(id: string) {
  await apiFetch(`/api/v1/backoffice/employees/${id}`, { method: 'DELETE' })
}

// ─── Backoffice: Outlets ───────────────────────────────────────
export async function getOutlets() {
  const res = await apiFetch<any[]>('/api/v1/backoffice/outlets')
  return res.data!
}

export async function createOutlet(outlet: any) {
  const res = await apiFetch<any>('/api/v1/backoffice/outlets', {
    method: 'POST',
    body: JSON.stringify(outlet),
  })
  return res.data!
}

export async function updateOutlet(id: string, outlet: any) {
  const res = await apiFetch<any>(`/api/v1/backoffice/outlets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(outlet),
  })
  return res.data!
}

export async function updateOutletStatus(id: string, status: 'active' | 'inactive') {
  await apiFetch(`/api/v1/backoffice/outlets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// ─── Backoffice: Settings ──────────────────────────────────────
export async function getSettings() {
  const res = await apiFetch<any>('/api/v1/backoffice/settings')
  return res.data!
}

export async function updateSettings(settings: any) {
  const res = await apiFetch<any>('/api/v1/backoffice/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
  return res.data!
}

// ─── Backoffice: Reports ───────────────────────────────────────
export async function getReportTransactions(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await apiFetch<any[]>(`/api/v1/backoffice/reports/transactions${query}`)
  return { data: res.data!, meta: res.meta }
}

export async function getReportShifts(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await apiFetch<any[]>(`/api/v1/backoffice/reports/shifts${query}`)
  return { data: res.data!, meta: res.meta }
}
