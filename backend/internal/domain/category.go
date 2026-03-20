package domain

import (
	"time"

	"github.com/google/uuid"
)

// Category groups products together (e.g., Coffee, Pastry).
type Category struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
}
