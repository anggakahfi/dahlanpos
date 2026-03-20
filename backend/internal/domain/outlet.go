package domain

import (
	"time"

	"github.com/google/uuid"
)

// OutletStatus represents whether an outlet is operational.
type OutletStatus string

const (
	OutletActive   OutletStatus = "active"
	OutletInactive OutletStatus = "inactive"
)

// Outlet represents a physical store location (branch).
type Outlet struct {
	ID        uuid.UUID    `json:"id"`
	Name      string       `json:"name"`
	Address   string       `json:"address,omitempty"`
	Phone     string       `json:"phone,omitempty"`
	Email     string       `json:"email,omitempty"`
	OpenTime  string       `json:"open_time,omitempty"`
	CloseTime string       `json:"close_time,omitempty"`
	Status    OutletStatus `json:"status"`
	CreatedAt time.Time    `json:"created_at"`
	UpdatedAt time.Time    `json:"updated_at"`
}
