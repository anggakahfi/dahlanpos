package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type activityLogRepo struct {
	pool *pgxpool.Pool
}

func NewActivityLogRepo(pool *pgxpool.Pool) *activityLogRepo {
	return &activityLogRepo{pool: pool}
}

func (r *activityLogRepo) Create(ctx context.Context, log *domain.ActivityLog) error {
	return r.pool.QueryRow(ctx,
		`INSERT INTO activity_logs (user_id, outlet_id, activity_type, details)
		 VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
		log.UserID, log.OutletID, log.ActivityType, log.Details,
	).Scan(&log.ID, &log.CreatedAt)
}

func (r *activityLogRepo) FindAll(ctx context.Context, filter repository.ActivityLogFilter) ([]domain.ActivityLog, int64, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	if filter.UserID != nil {
		conditions = append(conditions, fmt.Sprintf("a.user_id = $%d", argIdx))
		args = append(args, *filter.UserID)
		argIdx++
	}
	if filter.OutletID != nil {
		conditions = append(conditions, fmt.Sprintf("a.outlet_id = $%d", argIdx))
		args = append(args, *filter.OutletID)
		argIdx++
	}
	if filter.ActivityType != nil {
		conditions = append(conditions, fmt.Sprintf("a.activity_type = $%d", argIdx))
		args = append(args, *filter.ActivityType)
		argIdx++
	}

	where := ""
	if len(conditions) > 0 {
		where = "WHERE " + strings.Join(conditions, " AND ")
	}

	var total int64
	if err := r.pool.QueryRow(ctx, fmt.Sprintf("SELECT COUNT(*) FROM activity_logs a %s", where), args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	page := filter.Page
	if page < 1 {
		page = 1
	}
	perPage := filter.PerPage
	if perPage < 1 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	dataSQL := fmt.Sprintf(
		`SELECT a.id, a.user_id, a.outlet_id, a.activity_type, a.details, a.created_at,
		        u.name as user_name, COALESCE(o.name, '') as outlet_name
		 FROM activity_logs a
		 JOIN users u ON a.user_id = u.id
		 LEFT JOIN outlets o ON a.outlet_id = o.id
		 %s ORDER BY a.created_at DESC LIMIT $%d OFFSET $%d`, where, argIdx, argIdx+1)
	args = append(args, perPage, offset)

	rows, err := r.pool.Query(ctx, dataSQL, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var logs []domain.ActivityLog
	for rows.Next() {
		var l domain.ActivityLog
		if err := rows.Scan(&l.ID, &l.UserID, &l.OutletID, &l.ActivityType, &l.Details, &l.CreatedAt, &l.UserName, &l.OutletName); err != nil {
			return nil, 0, err
		}
		logs = append(logs, l)
	}
	return logs, total, rows.Err()
}
