# Small Things Coffee POS — REST API Specification v1.0

> **Base URL:** `https://api.smallthingscoffee.com/api/v1`
> **Auth:** Bearer JWT on every request except `/auth/*`
> **Content-Type:** `application/json`
> **Date format:** ISO 8601 (`2026-03-19T08:00:00Z`)
> **Currency:** All monetary values are integers in IDR.

---

## Table of Contents

1. [Conventions & Standards](#1-conventions--standards)
2. [Authentication (OAuth)](#2-authentication-oauth)
3. [Cashier — Menu & Catalog](#3-cashier--menu--catalog)
4. [Cashier — Checkout & Transactions](#4-cashier--checkout--transactions)
5. [Cashier — Shifts](#5-cashier--shifts)
6. [Cashier — Transaction History](#6-cashier--transaction-history)
7. [Backoffice — Dashboard](#7-backoffice--dashboard)
8. [Backoffice — Products & Categories](#8-backoffice--products--categories)
9. [Backoffice — Modifier Groups](#9-backoffice--modifier-groups)
10. [Backoffice — Employees](#10-backoffice--employees)
11. [Backoffice — Outlets](#11-backoffice--outlets)
12. [Backoffice — Reports](#12-backoffice--reports)
13. [Backoffice — Settings & Uploads](#13-backoffice--settings--uploads)
14. [Public — Receipts](#14-public--receipts)
15. [Error Handling & Pagination](#15-error-handling--pagination)

---

## 1. Conventions & Standards

All successful responses follow this shape:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "per_page": 20, "total": 100 }
}
```

All error responses follow this shape:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message"
  }
}
```

### Authentication Header
`Authorization: Bearer <jwt_token>`

### Role-Based Access
- `owner`: Full access to Backoffice + Cashier. Can view/manage all outlets.
- `cashier`: Cashier module only. Locked to their assigned `outlet_id`.

---

## 2. Authentication (OAuth)

### `POST /auth/login/oauth`

**Purpose:** Authenticate a user via Google OAuth and return a system JWT. The backend verifies the Google token, extracts the email, and checks if the email exists in the local `users` table.

**Request Body:**
```json
{
  "provider": "google",
  "id_token": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_at": "2026-03-20T08:00:00Z",
    "user": {
      "id": "uuid",
      "name": "Budi Santoso",
      "email": "budi@smallthings.com",
      "role": "cashier",
      "outlet_id": "outlet_1",
      "active_shift_id": "shift_uuid_or_null"
    }
  }
}
```

**Response `403 Forbidden` (Email not registered):**
```json
{
  "success": false,
  "error": {
    "code": "ACCESS_DENIED",
    "message": "Email tidak terdaftar di sistem Halaman Pos."
  }
}
```

### `POST /auth/logout`

**Purpose:** Invalidate the current JWT. Returns `200 OK`.

---

## 3. Cashier — Menu & Catalog

### `GET /cashier/menu`

**Purpose:** Returns the full active menu catalog. Applies globally to all outlets.

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "categories": [
      { "id": "cat_1", "name": "Coffee" },
      { "id": "cat_2", "name": "Non-Coffee" }
    ],
    "items": [
      {
        "id": "prod_1",
        "name": "Americano",
        "category_id": "cat_1",
        "price": 25000,
        "stock": 50,
        "image_url": "https://res.cloudinary.com/.../americano.jpg",
        "is_active": true,
        "modifier_group_ids": ["size"]
      }
    ],
    "modifier_groups": [
      {
        "id": "size",
        "name": "Size",
        "required": true,
        "options": [
          { "name": "Regular", "price_impact": 0 },
          { "name": "Large", "price_impact": 5000 }
        ]
      }
    ]
  }
}
```

---

## 4. Cashier — Checkout & Transactions

### `POST /cashier/transactions`

**Purpose:** Create a new transaction. Payment method (`cash` or `qris`) acts entirely as a record-keeper. There is no external QRIS generation. The cashier manually verifies QRIS payments outside the app before submitting.

**Request Body:**
```json
{
  "shift_id": "shift_uuid",
  "outlet_id": "outlet_1",
  "customer_name": "John",
  "payment_method": "qris",
  "items": [
    {
      "product_id": "prod_1",
      "product_name": "Americano",
      "quantity": 2,
      "unit_price": 25000,
      "modifiers": [
        { "group_name": "Size", "selected_option": "Large", "price_impact": 5000 }
      ]
    }
  ]
}
```

**Response `201 Created`:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "trx_uuid",
    "order_id": "ORD-20260319-001",
    "subtotal": 60000,
    "discount_amount": 0,
    "tax_amount": 0,
    "total_amount": 60000,
    "payment_method": "qris",
    "payment_status": "paid",
    "created_at": "2026-03-19T08:30:00Z"
  }
}
```

> [!NOTE]
> Stock is deducted immediately upon successful transaction creation since payment is assumed physically settled.

### `POST /cashier/transactions/:id/void`

**Purpose:** Void a transaction (e.g., if created by mistake).
**Response `200 OK`:** `{"status": "void"}`. Restores stock.

---

## 5. Cashier — Shifts

### `POST /cashier/shifts/open`
```json
{ "outlet_id": "outlet_1", "starting_cash": 500000 }
```

### `GET /cashier/shifts/current`
Returns active shift summary (total sales, cash expected). If none, returns `null`.

### `POST /cashier/shifts/close`
```json
{ "shift_id": "shift_uuid", "ending_cash": 1695000, "discrepancy_note": "" }
```

### `GET /cashier/shifts/current/summary`
**Purpose:** Returns a real-time summary of the active shift (sales breakdown by payment method) before closing.

---

## 6. Cashier — Transaction History

### `GET /cashier/transactions`

**Query Parameters:** `shift_id`, `date`, `payment_method`, `page`, `per_page`

**Response `200 OK`:**
Lists recent transactions locally for the cashier. Includes subtotal, total, and item breakdowns.

---

## 7. Backoffice — Dashboard Summary

### `GET /backoffice/dashboard/summary`

**Purpose:** Returns aggregated metrics. Owner can filter by `outlet_id`.
**Query Parameters:** `outlet_id` (default: all), `start_date`, `end_date` (ISO format).

Returns revenue, comparative changes, payment breakdown (Cash vs QRIS), top selling items, and out of stock alerts.

---

## 8. Backoffice — Products & Categories

### `GET /backoffice/categories`
### `POST /backoffice/categories`
### `PUT /backoffice/categories/:id`
### `DELETE /backoffice/categories/:id`

Standard CRUD for product categories.

### `GET /backoffice/products`
### `POST /backoffice/products`
Accepts `image_url` generated via direct Cloudinary frontend upload, or multipart form data if backend handles upload.
### `PUT /backoffice/products/:id`
### `PATCH /backoffice/products/:id/stock`
Quick stock override.
### `DELETE /backoffice/products/:id`

---

## 9. Backoffice — Modifier Groups

### `GET /backoffice/modifier-groups`
### `POST /backoffice/modifier-groups`
### `PUT /backoffice/modifier-groups/:id`
### `DELETE /backoffice/modifier-groups/:id`

---

## 10. Backoffice — Employees

### `GET /backoffice/employees`

**Response `200 OK`:** Returns list of users and their assigned outlet details.

### `POST /backoffice/employees`

**Purpose:** Add a new employee. Used to whitelist emails for OAuth login. **No password field required.**

**Request Body:**
```json
{
  "name": "Dewi Lestari",
  "email": "dewi@smallthings.com",
  "role": "cashier",
  "outlet_id": "outlet_1"
}
```

### `PUT /backoffice/employees/:id`
### `PATCH /backoffice/employees/:id/status`
Toggle `active`/`inactive` to revoke access instantly.

### `GET /backoffice/employees/activity`
**Purpose:** Retrieves audit logs for employee actions.
**Query Parameters:** `employee_id`, `outlet_id`, `activity_type`, `start_date`, `end_date`, `page`, `per_page`.
### `DELETE /backoffice/employees/:id`

---

## 11. Backoffice — Outlets

### `GET /backoffice/outlets`
### `POST /backoffice/outlets`
Registers a new branch location.
### `PUT /backoffice/outlets/:id`
### `PATCH /backoffice/outlets/:id/status`

---

## 12. Backoffice — Reports

### `GET /backoffice/reports/transactions`
Aggregated transactions list with filters (date range, outlet, payment method) for Owner export.

### `GET /backoffice/reports/shifts`
History of all past shifts to monitor discrepancy and cash flow matching.

### `GET /backoffice/reports/shifts/:id/summary`
**Purpose:** Returns the detailed sales breakdown and discrepancy report for a specific past shift.

---

## 13. Backoffice — Settings & Uploads

### `GET /backoffice/settings`

**Purpose:** Get global singleton configuration (Payment toggles, Receipt details, Tax rules).

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "payment": { "cash_enabled": true, "qris_enabled": true },
    "tax": { "enabled": false, "rate": 10, "name": "PPN", "type": "exclusive" },
    "receipt": {
      "logo_url": "https://res.cloudinary.com/.../logo.png",
      "header_text": "Small Things Coffee",
      "footer_message": "Follow our IG!",
      "show_tax_breakdown": true
    }
  }
}
```

### `PUT /backoffice/settings`
Full configuration update by the Owner.

### `POST /backoffice/upload`
**Purpose:** Uploads an image to Cloudinary and returns the URL.
**Request:** Multipart Form Data (`image` field).
**Response:** `{"success": true, "data": {"url": "..."}}`.

---

## 14. Public — Receipts

### `GET /public/receipts/:id`
**Purpose:** Publicly accessible endpoint to view a transaction receipt. Used for customer-facing QR codes. Returns a combined payload of transaction data, receipt settings, and outlet information.

**Response `200 OK`:**
```json
{
  "success": true,
  "transaction": { ... },
  "settings": { ... },
  "outlet": { ... }
}
```

---

## 15. Error Handling & Pagination

### Standard Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| `400` | `VALIDATION_ERROR` | Request body failed validation |
| `401` | `UNAUTHORIZED` | Missing or invalid JWT |
| `403` | `FORBIDDEN` | Valid JWT but insufficient role |
| `404` | `NOT_FOUND` | Resource does not exist |
| `422` | `UNPROCESSABLE` | Business rule violation (e.g., stock empty) |

### Pagination Structure
List endpoints support `?page=1&per_page=20`. Responses include a `meta` block:
```json
"meta": {
  "page": 1,
  "per_page": 20,
  "total": 156,
  "total_pages": 8
}
```
