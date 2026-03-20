package domain

import (
	"time"

	"github.com/google/uuid"
)

// UserRole represents the access level of a user.
type UserRole string

const (
	RoleOwner   UserRole = "owner"
	RoleCashier UserRole = "cashier"
)

// UserStatus represents the account status.
type UserStatus string

const (
	StatusActive   UserStatus = "active"
	StatusInactive UserStatus = "inactive"
)

// User represents an employee (owner or cashier) who logs in via OAuth.
type User struct {
	ID        uuid.UUID  `json:"id"`
	OutletID  *uuid.UUID `json:"outlet_id,omitempty"` // Nullable for owner
	Name      string     `json:"name"`
	Email     string     `json:"email"`
	Role      UserRole   `json:"role"`
	Status    UserStatus `json:"status"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}
