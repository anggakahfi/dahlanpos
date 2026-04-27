// API Client — centralized HTTP layer for communicating with the Go backend.
// All methods return typed data using the standardized API envelope:
// { success: true, data: T, meta?: { page, per_page, total, total_pages } }
// { success: false, error: { code: string, message: string } }

const API_BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')

import type { Transaction } from './types'

// ─── Multi-Session Auth Storage ──────────────────────────────
// Supports concurrent owner + cashier sessions in the same browser.
// Each role has its own token and user slots in localStorage.
// The "active" role is set per-module (backoffice sets 'owner', cashier sets 'cashier').

type UserRole = 'owner' | 'cashier'

let currentModuleRole: UserRole | null = null

// Called by each layout to declare which role context is active for API requests.
export function setCurrentModuleRole(role: UserRole) {
  currentModuleRole = role
}

export function getAuthSession(role: UserRole): { token: string; user: any } | null {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem(`auth_token_${role}`)
  const raw = localStorage.getItem(`auth_user_${role}`)
  if (!token || !raw) return null
  try {
    return { token, user: JSON.parse(raw) }
  } catch {
    return null
  }
}

export function setAuthSession(role: UserRole, token: string, user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`auth_token_${role}`, token)
    localStorage.setItem(`auth_user_${role}`, JSON.stringify(user))
  }
}

export function clearAuthSession(role: UserRole) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`auth_token_${role}`)
    localStorage.removeItem(`auth_user_${role}`)
  }
  // Also clear legacy single-slot keys on explicit logout
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
}

// ─── Legacy compatibility wrappers ───────────────────────────
// These read/write from the active module role so existing callers still work.

export function setAuthToken(token: string) {
  // Legacy: store in active role slot. During login we haven't set role yet, so
  // this is called only from loginOAuth which now uses setAuthSession directly.
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  // Prefer role-keyed token if a module role is active
  if (currentModuleRole) {
    const token = localStorage.getItem(`auth_token_${currentModuleRole}`)
    if (token) return token
  }
  // Fall back to legacy single-slot (for backward compat during migration)
  return localStorage.getItem('auth_token')
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    // Also clear both role slots
    clearAuthSession('owner')
    clearAuthSession('cashier')
  }
}


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
    const role = res.data.user.role
    // Store in role-keyed slot — preserves the other role's session
    setAuthSession(role, res.data.token, res.data.user)
  }
  return res.data!
}

export async function logout(role?: 'owner' | 'cashier') {
  try {
    await apiFetch('/api/v1/auth/logout', { method: 'POST' })
  } finally {
    if (role) {
      // Only clear the session for the role that's logging out
      clearAuthSession(role)
    } else {
      clearAuthToken() // Clear everything (legacy fallback)
    }
  }
}

// getStoredUser: backward-compat, reads from currentModuleRole or falls back to legacy slot
export function getStoredUser() {
  if (typeof window === 'undefined') return null
  if (currentModuleRole) {
    const session = getAuthSession(currentModuleRole)
    if (session) return session.user
  }
  // Legacy fallback
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

export async function getCurrentShiftSummary() {
  const res = await apiFetch<any>('/api/v1/cashier/shifts/current/summary')
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
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
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
  return { data: (res.data ?? []).map(mapTransaction), meta: res.meta }
}

export async function getTransaction(id: string) {
  const res = await apiFetch<any>(`/api/v1/cashier/transactions/${id}`)
  return mapTransaction(res.data!)
}

function mapTransaction(t: any): Transaction {
  const dateObj = new Date(t.created_at || new Date())
  return {
    id: t.id,
    orderId: t.order_id,
    outletId: t.outlet_id,
    outletName: t.outlet_name || "Unknown",
    date: dateObj.toISOString().split("T")[0],
    time: dateObj.toTimeString().split(" ")[0].slice(0, 5),
    createdAt: dateObj.toISOString(),
    cashierId: "Unknown", // Kasir ID would normally come from relation
    cashierName: "Cashier", // To get real cashier name, backend should join users table, but keeping default for now or we use user session
    customerName: t.customer_name || undefined,
    items: (t.items || []).map((i: any) => ({
      name: i.product_name,
      modifiers: Array.isArray(i.modifiers) ? i.modifiers.map((m: any) => m.selected_option || m.name || '').filter(Boolean).join(", ") : "",
      quantity: i.quantity,
      price: i.unit_price
    })),
    subtotal: t.subtotal,
    tax: t.tax_amount || 0,
    discount: t.discount_amount || 0,
    total: t.total_amount,
    paymentMethod: t.payment_method,
    status: t.payment_status,
  }
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
  const finalParams = { per_page: '1000', ...params }
  const query = '?' + new URLSearchParams(finalParams).toString()
  const res = await apiFetch<any[]>(`/api/v1/backoffice/products${query}`)
  return { data: res.data || [], meta: res.meta }
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

export async function getActivityLogs(params?: Record<string, any>) {
  const query = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v && v !== 'all') query.append(k, String(v))
    })
  }
  return apiFetch<any>(`/api/v1/backoffice/employees/activity?${query.toString()}`)
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

export async function deleteOutlet(id: string) {
  await apiFetch(`/api/v1/backoffice/outlets/${id}`, { method: 'DELETE' })
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

// ─── Backoffice: Uploads ───────────────────────────────────────
export async function uploadImage(file: File) {
  const token = getAuthToken()
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${API_BASE}/api/v1/backoffice/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: formData,
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.message || 'Failed to upload image')
  }

  const { data } = await response.json()
  return data.url
}

// ─── Backoffice: Dashboard ────────────────────────────────────
export async function getDashboardSummary(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await apiFetch<any>(`/api/v1/backoffice/dashboard/summary${query}`)
  return res.data
}

// ─── Backoffice: Reports ───────────────────────────────────────
export async function getReportTransactions(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await apiFetch<any[]>(`/api/v1/backoffice/reports/transactions${query}`)
  return { data: (res.data ?? []).map(mapTransaction), meta: res.meta, totalRevenue: (res.meta as any)?.total_revenue ?? 0 }
}

export async function getReportShifts(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : ''
  const res = await apiFetch<any[]>(`/api/v1/backoffice/reports/shifts${query}`)
  const mapped = (res.data ?? []).map((s: any) => ({
    id: s.id,
    cashierId: s.user_id,
    cashierName: s.cashier_name || 'Unknown',
    outletId: s.outlet_id,
    outletName: s.outlet_name || 'Unknown',
    startTime: s.started_at ? new Date(s.started_at).toLocaleString('id-ID') : '-',
    endTime: s.closed_at ? new Date(s.closed_at).toLocaleString('id-ID') : null,
    duration: (() => {
      if (!s.started_at) return '-';
      const start = new Date(s.started_at);
      const end = s.closed_at ? new Date(s.closed_at) : new Date();
      const diffMs = end.getTime() - start.getTime();
      if (diffMs < 0) return '0h 0m';
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${mins}m`;
    })(),
    beginningCash: s.starting_cash ?? 0,
    // BUG-13 FIX: Use backend data if available instead of hardcoding 0
    cashTransactions: s.cash_transactions ?? 0,
    cashAmount: s.cash_sales ?? s.cash_amount ?? 0,
    qrisTransactions: s.qris_transactions ?? 0,
    qrisAmount: s.qris_sales ?? s.qris_amount ?? 0,
    expectedCash: s.expected_cash ?? s.starting_cash ?? 0,
    actualCash: s.ending_cash ?? null,
    discrepancy: s.discrepancy ?? null,
    notes: s.discrepancy_note || null,
    status: s.status,
  }))
  return { data: mapped, meta: res.meta }
}

export async function getShiftSummary(shiftId: string) {
  const res = await apiFetch<any>(`/api/v1/backoffice/reports/shifts/${shiftId}/summary`)
  return res.data!
}

// ─── Public ───────────────────────────────────────────────────
export async function getPublicReceipt(id: string) {
  // This endpoint returns { success, transaction, settings, outlet } — NOT the standard { success, data } envelope
  // So we must fetch raw without going through the standard apiFetch wrapper
  const API_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
  const res = await fetch(`${API_URL}/api/v1/public/receipts/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Receipt not found')
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message || 'Failed to load receipt')
  return {
    transaction: json.transaction,
    settings: json.settings,
    outlet: json.outlet,
  }
}

