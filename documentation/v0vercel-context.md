## 📋 V0.DEV CONTEXT - SMALL THINGS COFFEE POS

---

## 🎯 PROJECT OVERVIEW

**Project Name:** Small Things Coffee POS  
**Type:** Single-Tenant Point of Sale untuk F&B (Multi-Outlet)  
**Style:** Low-Fidelity Wireframe (grayscale, boxes, minimal styling)  
**Tech Stack:** Next.js 14+, React, TypeScript, Tailwind CSS, shadcn/ui  

**Total Screens:** ~19 screens across 2 main modules (Backoffice & Cashier)

---

## 🎨 DESIGN SYSTEM

### **Color Palette (Low-Fidelity)**
```css
Background: #FAFAFA (light gray)
Surface: #FFFFFF (white)
Border: #E5E7EB (gray-200)
Text Primary: #1F2937 (gray-800)
Text Secondary: #6B7280 (gray-500)
Accent: #3B82F6 (blue-500) - for interactive elements
Success: #10B981 (green-500)
```

---

## 📐 LAYOUT SPECIFICATIONS

### **A. AUTHENTICATION PAGE**
Because this is an internal tool, there is no public landing page. The root URL (`/`) directly shows the Login screen.
```
Layout: min-h-screen, flex center
Card:
- Logo (Small Things Coffee)
- Title: "Masuk ke Sistem POS"
- Login Button: "Log in with Google" (OAuth)
```

---

### **B. BACKOFFICE (Desktop Layout)**

```
Root Layout:
├── Left Sidebar (w-64, fixed)
│   ├── Logo + Brand
│   ├── Navigation Menu
│   │   ├── Dashboard
│   │   ├── Reports (Transactions, Shifts)
│   │   ├── Library (Items, Categories, Modifiers)
│   │   ├── Employees
│   │   ├── Outlets
│   │   └── Settings (Payment, Receipt, Account)
│   └── User Profile (bottom)
│
└── Main Content (ml-64, min-h-screen)
    ├── Top Bar (Page Title)
    └── Content Area (p-6)
```

---

### **C. CASHIER (Tablet Layout - Landscape)**

```
POS Main Layout (Split Screen 60/40):
├── Left Panel (w-[60%])
│   ├── Top Bar (Outlet Name, End Shift Button)
│   ├── Category Tabs
│   └── Product Grid (Touch-friendly cards)
│
└── Right Panel (w-[40%])
    ├── Cart Header
    ├── Cart Items (Qty controls, Remove)
    ├── Summary (Subtotal, Total)
    └── Action Buttons (Cancel, Bayar)
```

---

## 📄 SCREEN SPECIFICATIONS

### **MODULE 1: BACKOFFICE**

#### **1. Dashboard Summary**
- Filters: Outlet Dropdown, Date Picker
- Metric Cards: Revenue, Transactions, Avg Order, Cash vs QRIS split
- Charts: Daily Revenue Line Chart, Payment Pie Chart
- Tables: Top 10 Selling Items, Low Stock Alert

#### **2. Reports - Transactions**
- Filters: Outlet, Date Range, Payment Method
- Table: Order ID, Time, Items, Payment, Total, Status
- Action: "Detail" opens receipt modal.

#### **3. Reports - Shifts**
- Table tracking Expected vs Actual Cash and discrepancy notes per cashier.

#### **4-6. Library (Products, Categories, Modifiers)**
- **Product List:** Grid of cards showing Image, Name, Price, Stock.
- **Product Form:** Upload Image, Name, Category, Price, Stock, Modifiers Select.
- **Categories/Modifiers:** Simple lists with CRUD Modals.

#### **7-8. Employees**
- **List:** Shows registered staff and their assigned roles/outlets.
- **Add Employee Modal:** 
  - Input: Name, Email (must match Google Email)
  - Dropdown: Role (Owner / Cashier)
  - Dropdown: Assign to Outlet
  - *Note: No password fields.*

#### **9-10. Outlets**
- **List:** Shows all branch locations.
- **Add Outlet Modal:** Name, Address, Phone.

#### **11-13. Settings**
- **Payment:** Checkboxes to enable/disable "Cash" and "QRIS" in the cashier view. (No API keys needed).
- **Receipt:** Setup Logo (image upload) and footer notes.
- **Account:** View Owner details.

---

### **MODULE 2: CASHIER**

#### **14. Shift Open Dialog**
- Shown on first login of the day.
- Input: `starting_cash` (Modal Awal).

#### **15. POS Home**
- Left: Product grid categorized by tabs. Clicking product adds to cart.
- Right: Active Cart.

#### **16. Modifier Dialog**
- Pops up if a clicked product has modifiers.
- E.g., Select "Size: Large (+5000)".

#### **17. Payment Processing Dialog**
- Shows Total Amount.
- Two big buttons: **[UANG PAS / CASH]** and **[QRIS (MANUAL VERIFY)]**
- Clicking either immediately completes the transaction and deducts stock. (QRIS assumes the cashier verified the customer's payment screen physically).

#### **18. Payment Success (Invoice)**
- "Transaksi Berhasil"
- Auto-print receipt button.
- "Order Baru" button to reset POS.

#### **19. Shift Close Dialog**
- Shown when user clicks "End Shift".
- Input: `ending_cash` (Uang di Laci Kasir).
- If mismatched with expected cash from system, requires `discrepancy_note` before allowing close.