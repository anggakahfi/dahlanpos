// DahlanPOS Type Definitions

// ============= OUTLETS =============
export interface Outlet {
  id: string
  name: string
  address: string
  phone: string
  email?: string
  open_time: string
  close_time: string
  status: 'active' | 'inactive'
  employee_count?: number
}

// ============= PRODUCTS =============
export interface Product {
  id: string
  name: string
  category_id?: string
  category_name?: string
  price: number
  stock: number
  unit: 'pcs' | 'kg' | 'liter' | 'porsi' | 'cup'
  low_stock_threshold: number
  description?: string
  image_url?: string
  modifier_group_ids: string[]
  is_active: boolean
  is_favorite: boolean
}

export interface MenuItem {
  id: string
  name: string
  categoryId: string
  price: number
  stock: number
  image: string
  isActive: boolean
  modifierGroupIds: string[]
}

export interface Category {
  id: string
  name: string
  itemCount: number
}

// ============= MODIFIERS =============
export interface ModifierOption {
  name: string
  price_impact: number
}

export interface ModifierGroup {
  id: string
  name: string
  required: boolean
  options: ModifierOption[]
  usedByCount: number
}

// ============= CART =============
export interface CartItemModifier {
  groupName: string
  selectedOption: string
  priceImpact: number
}

export interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  modifiers: CartItemModifier[]
  subtotal: number
  notes?: string
}

// ============= TRANSACTIONS =============
export interface TransactionItem {
  name: string
  modifiers: string
  quantity: number
  price: number
}

export interface Transaction {
  id: string
  orderId: string
  outletId: string
  outletName: string
  date: string
  time: string
  createdAt: string
  cashierId: string
  cashierName: string
  customerName?: string
  items: TransactionItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: 'cash' | 'qris'
  status: 'paid' | 'void'
}

// ============= EMPLOYEES =============
export interface Employee {
  id: string
  name: string
  email: string
  username: string
  role: 'owner' | 'cashier'
  outlet_id: string | null
  status: 'active' | 'inactive'
  createdAt: string
}

// ============= SHIFTS =============
export interface Shift {
  id: string
  employeeId: string
  outletId: string
  startTime: string
  endTime: string | null
  startingCash: number
  endingCash: number | null
  totalSales: number
  totalTransactions: number
  status: string
}

export interface ShiftRecord {
  id: string
  cashierId: string
  cashierName: string
  outletId: string
  outletName: string
  startTime: string
  endTime: string | null
  beginningCash: number
  cashTransactions: number
  cashAmount: number
  qrisTransactions: number
  qrisAmount: number
  expectedCash: number
  actualCash: number | null
  discrepancy: number | null
  notes: string | null
}

// ============= ACTIVITY LOG =============
export interface ActivityLog {
  id: string
  timestamp: string
  employeeId: string
  employeeName: string
  outletId: string
  outletName: string
  activityType: 'login' | 'logout' | 'start_shift' | 'end_shift' | 'transaction'
  details: string
}

// ============= SETTINGS =============
export interface PaymentSettings {
  cashEnabled: boolean
  qrisEnabled: boolean
  qrisProvider: 'xendit' | 'midtrans' | 'doku' | null
  qrisApiKey: string | null
  qrisMerchantId: string | null
  qrisStatus: 'connected' | 'disconnected'
}

export interface TaxSettings {
  enabled: boolean
  rate: number
  name: string
  type: 'inclusive' | 'exclusive'
}

export interface ReceiptSettings {
  logo: string | null
  headerText: string
  footerMessage: string
  showTaxBreakdown: boolean
}

// ============= BILLING =============
export interface BillingRecord {
  id: string
  date: string
  plan: 'basic' | 'premium'
  amount: number
  paymentMethod: string
  status: 'paid' | 'pending' | 'failed'
}

export interface Subscription {
  plan: 'basic' | 'premium'
  status: 'active' | 'expired'
  nextBillingDate: string
  amount: number
}

// ============= DASHBOARD METRICS =============
export interface DashboardMetrics {
  revenue: number
  revenueChange: number
  transactions: number
  voidTransactions: number
  avgOrderValue: number
  cashPercentage: number
  qrisPercentage: number
}

export interface TopItem {
  id: string
  name: string
  sold: number
  grossSales: number
  netSales: number
  grossProfit: number
}

export interface LowStockItem {
  id: string
  name: string
  stock: number
  unit: string
}

// ============= DATE RANGE =============
export interface DateRange {
  start: Date
  end: Date
}

export type QuickDateRange = 
  | 'today' 
  | 'yesterday' 
  | 'this_week' 
  | 'last_week' 
  | 'this_month' 
  | 'last_month'
  | 'this_year'
  | 'last_year'
  | 'custom'
