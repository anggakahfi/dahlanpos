package domain

import (
	"time"

	"github.com/google/uuid"
)

// ActivityType categorizes what action a user performed.
type ActivityType string

const (
	ActivityLogin       ActivityType = "login"
	ActivityLogout      ActivityType = "logout"
	ActivityStartShift  ActivityType = "start_shift"
	ActivityEndShift    ActivityType = "end_shift"
	ActivityTransaction ActivityType = "transaction"
)

// ActivityLog records an auditable action performed by a user.
type ActivityLog struct {
	ID           uuid.UUID    `json:"id"`
	UserID       uuid.UUID    `json:"user_id"`
	OutletID     *uuid.UUID   `json:"outlet_id,omitempty"`
	ActivityType ActivityType `json:"activity_type"`
	Details      string       `json:"details,omitempty"`
	CreatedAt    time.Time    `json:"created_at"`

	// Populated by joins
	UserName   string `json:"user_name,omitempty"`
	OutletName string `json:"outlet_name,omitempty"`
}
