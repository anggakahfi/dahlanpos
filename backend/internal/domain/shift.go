package domain

import (
	"time"

	"github.com/google/uuid"
)

// ShiftStatus represents whether a shift is currently active.
type ShiftStatus string

const (
	ShiftOpen   ShiftStatus = "open"
	ShiftClosed ShiftStatus = "closed"
)

// Shift represents a cashier's work session with cash tracking.
type Shift struct {
	ID               uuid.UUID   `json:"id"`
	UserID           uuid.UUID   `json:"user_id"`
	OutletID         uuid.UUID   `json:"outlet_id"`
	StartedAt        time.Time   `json:"started_at"`
	ClosedAt         *time.Time  `json:"closed_at,omitempty"`
	StartingCash     float64     `json:"starting_cash"`
	EndingCash       *float64    `json:"ending_cash,omitempty"`
	ExpectedCash     *float64    `json:"expected_cash,omitempty"`
	Discrepancy      *float64    `json:"discrepancy,omitempty"`
	DiscrepancyNote  *string     `json:"discrepancy_note,omitempty"`
	Status           ShiftStatus `json:"status"`

	// Populated by joins
	CashierName string `json:"cashier_name,omitempty"`
	OutletName  string `json:"outlet_name,omitempty"`
}

// ShiftSummary represents aggregated data for a specific shift.
type ShiftSummary struct {
	ShiftID           uuid.UUID `json:"shift_id"`
	TotalSales        float64   `json:"total_sales"`
	TotalTransactions int       `json:"total_transactions"`
	CashSales         float64   `json:"cash_sales"`
	CashTransactions  int       `json:"cash_transactions"`
	CardSales         float64   `json:"card_sales"`
	QRISSales         float64   `json:"qris_sales"`
	QRISTransactions  int       `json:"qris_transactions"`
	StartingCash      float64   `json:"starting_cash"`
	ExpectedCash      float64   `json:"expected_cash"`
	Refunds           float64   `json:"refunds"` // Optional, currently not tracked in DB but we keep for struct parity
	Voids             float64   `json:"voids"`
}
