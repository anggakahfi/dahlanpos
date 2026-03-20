// DahlanPOS Mock Data
// TODO: Replace with real API

import type {
  Outlet,
  Product,
  Category,
  ModifierGroup,
  Transaction,
  Employee,
  ShiftRecord,
  ActivityLog,
  BillingRecord,
  Subscription,
  TopItem,
  LowStockItem,
  MenuItem,
} from './types'

// ============= OUTLETS =============
export const outlets: Outlet[] = [
  {
    id: '1',
    name: 'KopaKopi Central',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '021-12345678',
    email: 'central@kopakopi.com',
    operatingHours: { open: '07:00', close: '22:00' },
    status: 'active',
    employeeCount: 5,
  },
  {
    id: '2',
    name: 'KopaKopi Sudirman',
    address: 'Jl. Jend. Sudirman No. 456, Jakarta Selatan',
    phone: '021-87654321',
    email: 'sudirman@kopakopi.com',
    operatingHours: { open: '08:00', close: '21:00' },
    status: 'active',
    employeeCount: 3,
  },
  {
    id: '3',
    name: 'KopaKopi BSD',
    address: 'Ruko Golden Boulevard, BSD City',
    phone: '021-55512345',
    email: 'bsd@kopakopi.com',
    operatingHours: { open: '09:00', close: '20:00' },
    status: 'inactive',
    employeeCount: 2,
  },
]

// ============= CATEGORIES =============
export const categories: Category[] = [
  { id: '1', name: 'Coffee', itemCount: 8 },
  { id: '2', name: 'Non-Coffee', itemCount: 5 },
  { id: '3', name: 'Snack', itemCount: 6 },
  { id: '4', name: 'Favorit', itemCount: 4 },
]

// ============= MODIFIER GROUPS =============
export const modifierGroups: ModifierGroup[] = [
  {
    id: 'size',
    name: 'Size',
    required: true,
    options: [
      { name: 'Small', priceImpact: 0 },
      { name: 'Medium', priceImpact: 5000 },
      { name: 'Large', priceImpact: 10000 },
    ],
    usedByCount: 12,
  },
  {
    id: 'sugar',
    name: 'Sugar Level',
    required: false,
    options: [
      { name: 'No Sugar', priceImpact: 0 },
      { name: 'Less Sugar', priceImpact: 0 },
      { name: 'Normal Sugar', priceImpact: 0 },
      { name: 'Extra Sugar', priceImpact: 0 },
    ],
    usedByCount: 10,
  },
  {
    id: 'temp',
    name: 'Temperature',
    required: true,
    options: [
      { name: 'Hot', priceImpact: 0 },
      { name: 'Ice', priceImpact: 0 },
    ],
    usedByCount: 12,
  },
  {
    id: 'milk',
    name: 'Milk Type',
    required: false,
    options: [
      { name: 'Regular Milk', priceImpact: 0 },
      { name: 'Oat Milk', priceImpact: 5000 },
      { name: 'Almond Milk', priceImpact: 7000 },
    ],
    usedByCount: 6,
  },
]

// ============= PRODUCTS =============
export const products: Product[] = [
  {
    id: '1',
    name: 'Americano',
    category: 'Coffee',
    price: 25000,
    stock: 50,
    unit: 'cup',
    lowStockThreshold: 10,
    description: 'Espresso shot with hot water',
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: ['size', 'sugar', 'temp'],
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Cappuccino',
    category: 'Coffee',
    price: 30000,
    stock: 45,
    unit: 'cup',
    lowStockThreshold: 10,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: ['size', 'sugar', 'temp', 'milk'],
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Latte',
    category: 'Coffee',
    price: 32000,
    stock: 40,
    unit: 'cup',
    lowStockThreshold: 10,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: ['size', 'sugar', 'temp', 'milk'],
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Mocha',
    category: 'Coffee',
    price: 35000,
    stock: 8,
    unit: 'cup',
    lowStockThreshold: 10,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: ['size', 'sugar', 'temp', 'milk'],
    isFavorite: true,
  },
  {
    id: '5',
    name: 'Espresso',
    category: 'Coffee',
    price: 20000,
    stock: 60,
    unit: 'cup',
    lowStockThreshold: 10,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: ['sugar'],
    isFavorite: false,
  },
  {
    id: '6',
    name: 'Caramel Macchiato',
    category: 'Coffee',
    price: 38000,
    stock: 0,
    unit: 'cup',
    lowStockThreshold: 10,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: ['size', 'sugar', 'temp', 'milk'],
    isFavorite: false,
  },
  {
    id: '7',
    name: 'Matcha Latte',
    category: 'Non-Coffee',
    price: 35000,
    stock: 30,
    unit: 'cup',
    lowStockThreshold: 10,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: ['size', 'sugar', 'temp', 'milk'],
    isFavorite: true,
  },
  {
    id: '8',
    name: 'Chocolate',
    category: 'Non-Coffee',
    price: 30000,
    stock: 35,
    unit: 'cup',
    lowStockThreshold: 10,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: ['size', 'temp', 'milk'],
    isFavorite: false,
  },
  {
    id: '9',
    name: 'Fresh Orange Juice',
    category: 'Non-Coffee',
    price: 28000,
    stock: 5,
    unit: 'cup',
    lowStockThreshold: 10,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: ['size'],
    isFavorite: false,
  },
  {
    id: '10',
    name: 'Croissant',
    category: 'Snack',
    price: 25000,
    stock: 20,
    unit: 'pcs',
    lowStockThreshold: 5,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: [],
    isFavorite: false,
  },
  {
    id: '11',
    name: 'Banana Bread',
    category: 'Snack',
    price: 22000,
    stock: 15,
    unit: 'pcs',
    lowStockThreshold: 5,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: [],
    isFavorite: false,
  },
  {
    id: '12',
    name: 'Cheese Cake',
    category: 'Snack',
    price: 35000,
    stock: 10,
    unit: 'pcs',
    lowStockThreshold: 5,
    image: '/placeholder.svg?height=200&width=200',
    modifierGroupIds: [],
    isFavorite: false,
  },
]

// ============= EMPLOYEES =============
export const employees: Employee[] = [
  {
    id: '1',
    name: 'Ahmad Dahlan',
    email: 'ahmad@kopakopi.com',
    username: 'ahmad_owner',
    role: 'owner',
    outletIds: ['1', '2', '3'],
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Budi Santoso',
    email: 'budi@kopakopi.com',
    username: 'budi_central',
    role: 'cashier',
    outletIds: ['1'],
    status: 'active',
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    name: 'Ojan Pratama',
    email: 'ojan@kopakopi.com',
    username: 'ojan_kopakopi',
    role: 'cashier',
    outletIds: ['1', '2'],
    status: 'active',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Siti Aminah',
    email: 'siti@kopakopi.com',
    username: 'siti_sudirman',
    role: 'cashier',
    outletIds: ['2'],
    status: 'inactive',
    createdAt: '2024-04-05',
  },
]

// ============= TRANSACTIONS =============
export const transactions: Transaction[] = [
  {
    id: '1',
    orderId: 'ORD-20250308-001',
    outletId: '1',
    outletName: 'KopaKopi Central',
    date: '2025-03-08',
    time: '14:30:25',
    cashierId: '3',
    cashierName: 'Ojan Pratama',
    items: [
      { name: 'Americano', modifiers: 'M, Less Sugar, Ice', quantity: 2, price: 60000 },
      { name: 'Croissant', modifiers: '', quantity: 1, price: 25000 },
    ],
    subtotal: 85000,
    tax: 9350,
    total: 94350,
    paymentMethod: 'qris',
    status: 'paid',
  },
  {
    id: '2',
    orderId: 'ORD-20250308-002',
    outletId: '1',
    outletName: 'KopaKopi Central',
    date: '2025-03-08',
    time: '15:45:12',
    cashierId: '3',
    cashierName: 'Ojan Pratama',
    items: [
      { name: 'Cappuccino', modifiers: 'L, Normal Sugar, Hot', quantity: 1, price: 40000 },
    ],
    subtotal: 40000,
    tax: 4400,
    total: 44400,
    paymentMethod: 'cash',
    status: 'paid',
  },
  {
    id: '3',
    orderId: 'ORD-20250308-003',
    outletId: '2',
    outletName: 'KopaKopi Sudirman',
    date: '2025-03-08',
    time: '16:20:00',
    cashierId: '4',
    cashierName: 'Siti Aminah',
    items: [
      { name: 'Matcha Latte', modifiers: 'M, Less Sugar, Ice', quantity: 2, price: 80000 },
      { name: 'Cheese Cake', modifiers: '', quantity: 2, price: 70000 },
    ],
    subtotal: 150000,
    tax: 16500,
    total: 166500,
    paymentMethod: 'qris',
    status: 'paid',
  },
  {
    id: '4',
    orderId: 'ORD-20250308-004',
    outletId: '1',
    outletName: 'KopaKopi Central',
    date: '2025-03-08',
    time: '17:00:30',
    cashierId: '2',
    cashierName: 'Budi Santoso',
    items: [
      { name: 'Latte', modifiers: 'S, No Sugar, Hot', quantity: 1, price: 32000 },
    ],
    subtotal: 32000,
    tax: 3520,
    total: 35520,
    paymentMethod: 'cash',
    status: 'void',
  },
  {
    id: '5',
    orderId: 'ORD-20250307-001',
    outletId: '1',
    outletName: 'KopaKopi Central',
    date: '2025-03-07',
    time: '10:15:00',
    cashierId: '3',
    cashierName: 'Ojan Pratama',
    items: [
      { name: 'Espresso', modifiers: 'Normal Sugar', quantity: 2, price: 40000 },
      { name: 'Banana Bread', modifiers: '', quantity: 1, price: 22000 },
    ],
    subtotal: 62000,
    tax: 6820,
    total: 68820,
    paymentMethod: 'cash',
    status: 'paid',
  },
]

// ============= SHIFT RECORDS =============
export const shiftRecords: ShiftRecord[] = [
  {
    id: '1',
    cashierId: '3',
    cashierName: 'Ojan Pratama',
    outletId: '1',
    outletName: 'KopaKopi Central',
    startTime: '2025-03-08 08:00:00',
    endTime: '2025-03-08 16:00:00',
    beginningCash: 500000,
    cashTransactions: 25,
    cashAmount: 750000,
    qrisTransactions: 18,
    qrisAmount: 540000,
    expectedCash: 1250000,
    actualCash: 1245000,
    discrepancy: -5000,
    notes: 'Kembalian salah ke customer',
  },
  {
    id: '2',
    cashierId: '2',
    cashierName: 'Budi Santoso',
    outletId: '1',
    outletName: 'KopaKopi Central',
    startTime: '2025-03-08 16:00:00',
    endTime: '2025-03-08 22:00:00',
    beginningCash: 500000,
    cashTransactions: 15,
    cashAmount: 450000,
    qrisTransactions: 12,
    qrisAmount: 380000,
    expectedCash: 950000,
    actualCash: 950000,
    discrepancy: 0,
    notes: null,
  },
  {
    id: '3',
    cashierId: '4',
    cashierName: 'Siti Aminah',
    outletId: '2',
    outletName: 'KopaKopi Sudirman',
    startTime: '2025-03-08 08:00:00',
    endTime: '2025-03-08 15:00:00',
    beginningCash: 300000,
    cashTransactions: 10,
    cashAmount: 280000,
    qrisTransactions: 20,
    qrisAmount: 620000,
    expectedCash: 580000,
    actualCash: 595000,
    discrepancy: 15000,
    notes: 'Customer bayar lebih, tidak mau kembalian',
  },
]

// ============= ACTIVITY LOGS =============
export const activityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2025-03-08 08:00:00',
    employeeId: '3',
    employeeName: 'Ojan Pratama',
    outletId: '1',
    outletName: 'KopaKopi Central',
    activityType: 'login',
    details: 'Login successful',
  },
  {
    id: '2',
    timestamp: '2025-03-08 08:01:00',
    employeeId: '3',
    employeeName: 'Ojan Pratama',
    outletId: '1',
    outletName: 'KopaKopi Central',
    activityType: 'start_shift',
    details: 'Started shift with Rp 500.000 cash',
  },
  {
    id: '3',
    timestamp: '2025-03-08 14:30:25',
    employeeId: '3',
    employeeName: 'Ojan Pratama',
    outletId: '1',
    outletName: 'KopaKopi Central',
    activityType: 'transaction',
    details: 'ORD-20250308-001 - Rp 94.350 (QRIS)',
  },
  {
    id: '4',
    timestamp: '2025-03-08 16:00:00',
    employeeId: '3',
    employeeName: 'Ojan Pratama',
    outletId: '1',
    outletName: 'KopaKopi Central',
    activityType: 'end_shift',
    details: 'Ended shift. Discrepancy: -Rp 5.000',
  },
  {
    id: '5',
    timestamp: '2025-03-08 16:01:00',
    employeeId: '3',
    employeeName: 'Ojan Pratama',
    outletId: '1',
    outletName: 'KopaKopi Central',
    activityType: 'logout',
    details: 'Logout successful',
  },
]

// ============= BILLING =============
export const billingRecords: BillingRecord[] = [
  {
    id: '1',
    date: '2025-03-01',
    plan: 'basic',
    amount: 99000,
    paymentMethod: 'Bank Transfer',
    status: 'paid',
  },
  {
    id: '2',
    date: '2025-02-01',
    plan: 'basic',
    amount: 99000,
    paymentMethod: 'QRIS',
    status: 'paid',
  },
  {
    id: '3',
    date: '2025-01-01',
    plan: 'basic',
    amount: 99000,
    paymentMethod: 'Bank Transfer',
    status: 'paid',
  },
]

export const subscription: Subscription = {
  plan: 'basic',
  status: 'active',
  nextBillingDate: '2025-04-01',
  amount: 99000,
}

// ============= DASHBOARD DATA =============
export const topItems: TopItem[] = [
  { id: '1', name: 'Americano', sold: 156, grossSales: 3900000, netSales: 3510000, grossProfit: 2340000 },
  { id: '2', name: 'Cappuccino', sold: 124, grossSales: 3720000, netSales: 3348000, grossProfit: 1860000 },
  { id: '3', name: 'Matcha Latte', sold: 98, grossSales: 3430000, netSales: 3087000, grossProfit: 1715000 },
  { id: '4', name: 'Latte', sold: 87, grossSales: 2784000, netSales: 2505600, grossProfit: 1392000 },
  { id: '5', name: 'Mocha', sold: 76, grossSales: 2660000, netSales: 2394000, grossProfit: 1330000 },
  { id: '6', name: 'Croissant', sold: 65, grossSales: 1625000, netSales: 1462500, grossProfit: 975000 },
  { id: '7', name: 'Cheese Cake', sold: 54, grossSales: 1890000, netSales: 1701000, grossProfit: 945000 },
  { id: '8', name: 'Chocolate', sold: 48, grossSales: 1440000, netSales: 1296000, grossProfit: 720000 },
  { id: '9', name: 'Espresso', sold: 42, grossSales: 840000, netSales: 756000, grossProfit: 504000 },
  { id: '10', name: 'Banana Bread', sold: 38, grossSales: 836000, netSales: 752400, grossProfit: 418000 },
]

export const lowStockItems: LowStockItem[] = [
  { id: '6', name: 'Caramel Macchiato', stock: 0, unit: 'cup' },
  { id: '9', name: 'Fresh Orange Juice', stock: 5, unit: 'cup' },
  { id: '4', name: 'Mocha', stock: 8, unit: 'cup' },
]

// ============= CHART DATA =============
export const dailyRevenueData = [
  { date: '01 Mar', revenue: 1250000 },
  { date: '02 Mar', revenue: 1380000 },
  { date: '03 Mar', revenue: 1120000 },
  { date: '04 Mar', revenue: 1450000 },
  { date: '05 Mar', revenue: 1680000 },
  { date: '06 Mar', revenue: 1340000 },
  { date: '07 Mar', revenue: 1520000 },
  { date: '08 Mar', revenue: 1340000 },
]

export const weekdayRevenueData = [
  { day: 'Mon', revenue: 1250000 },
  { day: 'Tue', revenue: 1380000 },
  { day: 'Wed', revenue: 1120000 },
  { day: 'Thu', revenue: 1450000 },
  { day: 'Fri', revenue: 1680000 },
  { day: 'Sat', revenue: 1890000 },
  { day: 'Sun', revenue: 1520000 },
]

export const hourlyRevenueData = [
  { hour: '07', revenue: 150000 },
  { hour: '08', revenue: 280000 },
  { hour: '09', revenue: 420000 },
  { hour: '10', revenue: 380000 },
  { hour: '11', revenue: 320000 },
  { hour: '12', revenue: 450000 },
  { hour: '13', revenue: 520000 },
  { hour: '14', revenue: 380000 },
  { hour: '15', revenue: 290000 },
  { hour: '16', revenue: 350000 },
  { hour: '17', revenue: 420000 },
  { hour: '18', revenue: 480000 },
  { hour: '19', revenue: 390000 },
  { hour: '20', revenue: 280000 },
  { hour: '21', revenue: 150000 },
]

export const paymentBreakdownData = [
  { name: 'Cash', value: 55, amount: 737000 },
  { name: 'QRIS', value: 45, amount: 603000 },
]

// ============= FAQ DATA =============
export const faqData = [
  {
    question: 'Apa itu DahlanPOS?',
    answer: 'DahlanPOS adalah sistem Point of Sale (POS) berbasis cloud yang dirancang khusus untuk UMKM F&B di Indonesia. Dengan DahlanPOS, Anda dapat mengelola transaksi, stok, dan laporan bisnis dengan mudah.',
  },
  {
    question: 'Berapa biaya berlangganan DahlanPOS?',
    answer: 'Paket Basic kami tersedia dengan harga Rp 99.000/bulan yang mencakup semua fitur dasar yang dibutuhkan untuk menjalankan bisnis F&B Anda.',
  },
  {
    question: 'Apakah ada masa percobaan gratis?',
    answer: 'Ya! Kami menyediakan masa percobaan gratis selama 14 hari tanpa perlu kartu kredit. Anda dapat mencoba semua fitur DahlanPOS sebelum memutuskan berlangganan.',
  },
  {
    question: 'Perangkat apa saja yang didukung?',
    answer: 'DahlanPOS dapat diakses melalui browser di laptop, tablet, dan smartphone. Untuk pengalaman kasir terbaik, kami merekomendasikan penggunaan tablet dengan orientasi landscape.',
  },
  {
    question: 'Bagaimana cara setup QRIS?',
    answer: 'Anda dapat mengintegrasikan QRIS melalui menu Settings > Payment Methods. Kami mendukung berbagai provider seperti Xendit, Midtrans, dan DOKU.',
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Keamanan data adalah prioritas kami. Semua data dienkripsi dan disimpan di server yang aman dengan backup harian.',
  },
]

// ============= FEATURES DATA =============
export const featuresData = [
  {
    title: 'Manajemen Transaksi',
    description: 'Proses transaksi dengan cepat dan mudah. Dukung pembayaran tunai dan QRIS.',
    icon: 'receipt',
  },
  {
    title: 'Manajemen Stok',
    description: 'Pantau stok barang secara real-time dengan notifikasi stok menipis.',
    icon: 'package',
  },
  {
    title: 'Laporan Bisnis',
    description: 'Analisis penjualan dengan laporan harian, mingguan, dan bulanan.',
    icon: 'chart',
  },
  {
    title: 'Multi-Outlet',
    description: 'Kelola beberapa outlet dari satu dashboard yang terintegrasi.',
    icon: 'store',
  },
  {
    title: 'Manajemen Karyawan',
    description: 'Atur akses karyawan dan pantau aktivitas shift mereka.',
    icon: 'users',
  },
  {
    title: 'Kustomisasi Menu',
    description: 'Tambahkan modifier dan varian untuk produk Anda dengan mudah.',
    icon: 'settings',
  },
]

export const benefitsData = [
  {
    title: 'Hemat Waktu',
    description: 'Proses transaksi 3x lebih cepat dibanding cara manual.',
  },
  {
    title: 'Kurangi Human Error',
    description: 'Sistem otomatis menghitung total dan kembalian.',
  },
  {
    title: 'Keputusan Berbasis Data',
    description: 'Laporan detail membantu Anda mengambil keputusan bisnis yang tepat.',
  },
  {
    title: 'Akses Dimana Saja',
    description: 'Pantau bisnis Anda dari mana saja melalui browser.',
  },
]
// ============= MENU ITEMS =============
export const menuItems: MenuItem[] = products.map((product) => {
  const categoryId =
    categories.find((c) => c.name === product.category)?.id || '1'
  return {
    id: product.id,
    name: product.name,
    categoryId: categoryId,
    price: product.price,
    stock: product.stock,
    image: product.image,
    isActive: product.stock > 0,
    modifierGroupIds: product.modifierGroupIds || [],
  }
})
