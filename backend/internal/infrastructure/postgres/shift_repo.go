package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type shiftRepo struct {
	pool *pgxpool.Pool
}

func NewShiftRepo(pool *pgxpool.Pool) *shiftRepo {
	return &shiftRepo{pool: pool}
}

func (r *shiftRepo) FindOpenByUser(ctx context.Context, userID uuid.UUID) (*domain.Shift, error) {
	var s domain.Shift
	err := r.pool.QueryRow(ctx,
		`SELECT s.id, s.user_id, s.outlet_id, s.started_at, s.closed_at, s.starting_cash,
		        s.ending_cash, s.expected_cash, s.discrepancy, s.discrepancy_note, s.status,
		        u.name as cashier_name, o.name as outlet_name
		 FROM shifts s
		 JOIN users u ON s.user_id = u.id
		 JOIN outlets o ON s.outlet_id = o.id
		 WHERE s.user_id = $1 AND s.status = 'open'`, userID,
	).Scan(
		&s.ID, &s.UserID, &s.OutletID, &s.StartedAt, &s.ClosedAt, &s.StartingCash,
		&s.EndingCash, &s.ExpectedCash, &s.Discrepancy, &s.DiscrepancyNote, &s.Status,
		&s.CashierName, &s.OutletName,
	)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *shiftRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Shift, error) {
	var s domain.Shift
	err := r.pool.QueryRow(ctx,
		`SELECT s.id, s.user_id, s.outlet_id, s.started_at, s.closed_at, s.starting_cash,
		        s.ending_cash, s.expected_cash, s.discrepancy, s.discrepancy_note, s.status,
		        u.name as cashier_name, o.name as outlet_name
		 FROM shifts s
		 JOIN users u ON s.user_id = u.id
		 JOIN outlets o ON s.outlet_id = o.id
		 WHERE s.id = $1`, id,
	).Scan(
		&s.ID, &s.UserID, &s.OutletID, &s.StartedAt, &s.ClosedAt, &s.StartingCash,
		&s.EndingCash, &s.ExpectedCash, &s.Discrepancy, &s.DiscrepancyNote, &s.Status,
		&s.CashierName, &s.OutletName,
	)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *shiftRepo) FindAll(ctx context.Context, outletID *uuid.UUID, page, perPage int) ([]domain.Shift, int64, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	if outletID != nil {
		conditions = append(conditions, fmt.Sprintf("s.outlet_id = $%d", argIdx))
		args = append(args, *outletID)
		argIdx++
	}

	where := ""
	if len(conditions) > 0 {
		where = "WHERE " + strings.Join(conditions, " AND ")
	}

	var total int64
	if err := r.pool.QueryRow(ctx, fmt.Sprintf("SELECT COUNT(*) FROM shifts s %s", where), args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 20
	}
	offset := (page - 1) * perPage

	dataSQL := fmt.Sprintf(
		`SELECT s.id, s.user_id, s.outlet_id, s.started_at, s.closed_at, s.starting_cash,
		        s.ending_cash, s.expected_cash, s.discrepancy, s.discrepancy_note, s.status,
		        u.name as cashier_name, o.name as outlet_name
		 FROM shifts s
		 JOIN users u ON s.user_id = u.id
		 JOIN outlets o ON s.outlet_id = o.id
		 %s ORDER BY s.started_at DESC LIMIT $%d OFFSET $%d`, where, argIdx, argIdx+1)
	args = append(args, perPage, offset)

	rows, err := r.pool.Query(ctx, dataSQL, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var shifts []domain.Shift
	for rows.Next() {
		var s domain.Shift
		if err := rows.Scan(
			&s.ID, &s.UserID, &s.OutletID, &s.StartedAt, &s.ClosedAt, &s.StartingCash,
			&s.EndingCash, &s.ExpectedCash, &s.Discrepancy, &s.DiscrepancyNote, &s.Status,
			&s.CashierName, &s.OutletName,
		); err != nil {
			return nil, 0, err
		}
		shifts = append(shifts, s)
	}
	return shifts, total, rows.Err()
}

func (r *shiftRepo) Create(ctx context.Context, shift *domain.Shift) error {
	return r.pool.QueryRow(ctx,
		`INSERT INTO shifts (user_id, outlet_id, starting_cash) VALUES ($1, $2, $3) RETURNING id, started_at`,
		shift.UserID, shift.OutletID, shift.StartingCash,
	).Scan(&shift.ID, &shift.StartedAt)
}

func (r *shiftRepo) Close(ctx context.Context, shift *domain.Shift) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE shifts SET closed_at=NOW(), ending_cash=$1, expected_cash=$2, discrepancy=$3,
		 discrepancy_note=$4, status='closed' WHERE id=$5`,
		shift.EndingCash, shift.ExpectedCash, shift.Discrepancy, shift.DiscrepancyNote, shift.ID,
	)
	return err
}
