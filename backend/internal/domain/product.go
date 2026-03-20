package domain

import (
	"time"

	"github.com/google/uuid"
)

// ProductUnit represents the unit of measurement for stock.
type ProductUnit string

const (
	UnitPcs   ProductUnit = "pcs"
	UnitKg    ProductUnit = "kg"
	UnitLiter ProductUnit = "liter"
	UnitPorsi ProductUnit = "porsi"
	UnitCup   ProductUnit = "cup"
)

// Product represents a sellable item in the centralized catalog.
type Product struct {
	ID                uuid.UUID   `json:"id"`
	CategoryID        *uuid.UUID  `json:"category_id,omitempty"`
	Name              string      `json:"name"`
	Price             float64     `json:"price"`
	Stock             int         `json:"stock"`
	Unit              ProductUnit `json:"unit"`
	LowStockThreshold int         `json:"low_stock_threshold"`
	Description       string      `json:"description,omitempty"`
	ImageURL          string      `json:"image_url,omitempty"`
	IsActive          bool        `json:"is_active"`
	IsFavorite        bool        `json:"is_favorite"`
	CreatedAt         time.Time   `json:"created_at"`
	UpdatedAt         time.Time   `json:"updated_at"`

	// Populated by joins, not stored directly
	CategoryName     string       `json:"category_name,omitempty"`
	ModifierGroupIDs []uuid.UUID  `json:"modifier_group_ids,omitempty"`
}
