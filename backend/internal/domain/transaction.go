package domain

import (
	"time"

	"github.com/google/uuid"
)

// PaymentMethod represents how a transaction was paid.
type PaymentMethod string

const (
	PayCash PaymentMethod = "cash"
	PayQRIS PaymentMethod = "qris"
)

// PaymentStatus represents the lifecycle state of a payment.
type PaymentStatus string

const (
	PaymentPending PaymentStatus = "pending"
	PaymentPaid    PaymentStatus = "paid"
	PaymentVoid    PaymentStatus = "void"
)

// Transaction represents a completed order/sale.
type Transaction struct {
	ID             uuid.UUID     `json:"id"`
	ShiftID        uuid.UUID     `json:"shift_id"`
	OutletID       uuid.UUID     `json:"outlet_id"`
	OrderID        string        `json:"order_id"`
	CustomerName   string        `json:"customer_name,omitempty"`
	Subtotal       float64       `json:"subtotal"`
	DiscountAmount float64       `json:"discount_amount"`
	TaxAmount      float64       `json:"tax_amount"`
	TotalAmount    float64       `json:"total_amount"`
	PaymentMethod  PaymentMethod `json:"payment_method"`
	PaymentStatus  PaymentStatus `json:"payment_status"`
	PaidAt         *time.Time    `json:"paid_at,omitempty"`
	CreatedAt      time.Time     `json:"created_at"`
	UpdatedAt      time.Time     `json:"updated_at"`

	// Populated by joins / nested loading
	Items []TransactionItem `json:"items,omitempty"`
}

// TransactionItem is a line item within a transaction.
type TransactionItem struct {
	ID            uuid.UUID          `json:"id"`
	TransactionID uuid.UUID          `json:"transaction_id"`
	ProductID     *uuid.UUID         `json:"product_id,omitempty"`
	ProductName   string             `json:"product_name"`
	Quantity      int                `json:"quantity"`
	UnitPrice     float64            `json:"unit_price"`
	Subtotal      float64            `json:"subtotal"`
	Modifiers     []SelectedModifier `json:"modifiers"`
}

// CreateTransactionRequest is the inbound DTO for creating a transaction.
type CreateTransactionRequest struct {
	ShiftID       uuid.UUID                    `json:"shift_id" binding:"required"`
	OutletID      uuid.UUID                    `json:"outlet_id" binding:"required"`
	CustomerName  string                       `json:"customer_name"`
	PaymentMethod PaymentMethod                `json:"payment_method" binding:"required"`
	Items         []CreateTransactionItemInput `json:"items" binding:"required,min=1"`
}

// CreateTransactionItemInput is a single item in the create transaction request.
type CreateTransactionItemInput struct {
	ProductID    uuid.UUID          `json:"product_id" binding:"required"`
	ProductName  string             `json:"product_name" binding:"required"`
	Quantity     int                `json:"quantity" binding:"required,min=1"`
	UnitPrice    float64            `json:"unit_price" binding:"required"`
	Modifiers    []SelectedModifier `json:"modifiers"`
}
