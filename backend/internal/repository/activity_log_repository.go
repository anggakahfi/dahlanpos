package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// ActivityLogFilter defines query parameters for listing activity logs.
type ActivityLogFilter struct {
	UserID       *uuid.UUID
	OutletID     *uuid.UUID
	ActivityType *domain.ActivityType
	Page         int
	PerPage      int
}

// ActivityLogRepository defines the contract for activity log data access.
type ActivityLogRepository interface {
	Create(ctx context.Context, log *domain.ActivityLog) error
	FindAll(ctx context.Context, filter ActivityLogFilter) ([]domain.ActivityLog, int64, error)
}
