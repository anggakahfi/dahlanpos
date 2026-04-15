package postgres

import (
	"context"
	"fmt"
	"strings"
	"time"

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
	var discrepancyNote string
	err := r.pool.QueryRow(ctx,
		`SELECT s.id, s.user_id, s.outlet_id, s.started_at, s.closed_at, s.starting_cash,
		        s.ending_cash, s.expected_cash, s.discrepancy, COALESCE(s.discrepancy_note, '') as discrepancy_note, s.status,
		        COALESCE(u.name, '') as cashier_name, COALESCE(o.name, '') as outlet_name
		 FROM shifts s
		 LEFT JOIN users u ON s.user_id = u.id
		 LEFT JOIN outlets o ON s.outlet_id = o.id
		 WHERE s.user_id = $1 AND s.status = 'open'
		 ORDER BY s.started_at DESC LIMIT 1`, userID,
	).Scan(
		&s.ID, &s.UserID, &s.OutletID, &s.StartedAt, &s.ClosedAt, &s.StartingCash,
		&s.EndingCash, &s.ExpectedCash, &s.Discrepancy, &discrepancyNote, &s.Status,
		&s.CashierName, &s.OutletName,
	)
	if err != nil {
		return nil, err
	}
	if discrepancyNote != "" {
		s.DiscrepancyNote = &discrepancyNote
	}
	return &s, nil
}

func (r *shiftRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Shift, error) {
	var s domain.Shift
	var discrepancyNote string
	err := r.pool.QueryRow(ctx,
		`SELECT s.id, s.user_id, s.outlet_id, s.started_at, s.closed_at, s.starting_cash,
		        s.ending_cash, s.expected_cash, s.discrepancy, COALESCE(s.discrepancy_note, '') as discrepancy_note, s.status,
		        COALESCE(u.name, '') as cashier_name, COALESCE(o.name, '') as outlet_name
		 FROM shifts s
		 LEFT JOIN users u ON s.user_id = u.id
		 LEFT JOIN outlets o ON s.outlet_id = o.id
		 WHERE s.id = $1`, id,
	).Scan(
		&s.ID, &s.UserID, &s.OutletID, &s.StartedAt, &s.ClosedAt, &s.StartingCash,
		&s.EndingCash, &s.ExpectedCash, &s.Discrepancy, &discrepancyNote, &s.Status,
		&s.CashierName, &s.OutletName,
	)
	if err != nil {
		return nil, err
	}
	if discrepancyNote != "" {
		s.DiscrepancyNote = &discrepancyNote
	}
	return &s, nil
}

func (r *shiftRepo) FindAll(ctx context.Context, outletID *uuid.UUID, userID *uuid.UUID, startDate *time.Time, endDate *time.Time, page, perPage int) ([]domain.Shift, int64, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	if outletID != nil {
		conditions = append(conditions, fmt.Sprintf("s.outlet_id = $%d", argIdx))
		args = append(args, *outletID)
		argIdx++
	}
	if userID != nil {
		conditions = append(conditions, fmt.Sprintf("s.user_id = $%d", argIdx))
		args = append(args, *userID)
		argIdx++
	}
	if startDate != nil {
		conditions = append(conditions, fmt.Sprintf("s.started_at >= $%d", argIdx))
		args = append(args, *startDate)
		argIdx++
	}
	if endDate != nil {
		conditions = append(conditions, fmt.Sprintf("s.started_at <= $%d", argIdx))
		args = append(args, *endDate)
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
		        s.ending_cash, s.expected_cash, s.discrepancy, COALESCE(s.discrepancy_note, '') as discrepancy_note, s.status,
		        COALESCE(u.name, '') as cashier_name, COALESCE(o.name, '') as outlet_name
		 FROM shifts s
		 LEFT JOIN users u ON s.user_id = u.id
		 LEFT JOIN outlets o ON s.outlet_id = o.id
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
		var discrepancyNote string
		if err := rows.Scan(
			&s.ID, &s.UserID, &s.OutletID, &s.StartedAt, &s.ClosedAt, &s.StartingCash,
			&s.EndingCash, &s.ExpectedCash, &s.Discrepancy, &discrepancyNote, &s.Status,
			&s.CashierName, &s.OutletName,
		); err != nil {
			return nil, 0, err
		}
		if discrepancyNote != "" {
			s.DiscrepancyNote = &discrepancyNote
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
		`UPDATE shifts SET closed_at = NOW(), ending_cash = $1, expected_cash = $2, discrepancy = $3, discrepancy_note = $4, status = 'closed'
		 WHERE id = $5`,
		shift.EndingCash, shift.ExpectedCash, shift.Discrepancy, shift.DiscrepancyNote, shift.ID,
	)
	return err
}

func (r *shiftRepo) AutoCloseExpiredShifts(ctx context.Context) (int64, error) {
	query := `
		WITH expired_shifts AS (
			SELECT s.id 
			FROM shifts s
			JOIN outlets o ON s.outlet_id = o.id
			WHERE s.status = 'open'
			  AND o.closing_time IS NOT NULL AND o.opening_time IS NOT NULL
			  AND (
				(o.closing_time >= o.opening_time AND 
				 ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::time > (o.closing_time + interval '30 minutes') OR 
				  (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::time < o.opening_time)
				)
				OR
				(o.closing_time < o.opening_time AND 
				 (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::time > (o.closing_time + interval '30 minutes') AND
				 (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta')::time < o.opening_time
				)
			  )
		),
		-- BUG-08 FIX: Calculate actual cash sales per shift to determine correct expected_cash
		shift_cash AS (
			SELECT e.id AS shift_id,
				   COALESCE(SUM(CASE WHEN t.payment_method = 'cash' AND t.payment_status = 'paid' THEN t.total_amount ELSE 0 END), 0) AS cash_sales
			FROM expired_shifts e
			LEFT JOIN transactions t ON t.shift_id = e.id
			GROUP BY e.id
		)
		UPDATE shifts s
		SET status = 'closed',
			closed_at = NOW(),
			discrepancy_note = 'Sistem: Auto-Closed (Melewati batas jam operasional + 30 menit)',
			ending_cash = s.starting_cash,
			expected_cash = s.starting_cash + sc.cash_sales,
			discrepancy = s.starting_cash - (s.starting_cash + sc.cash_sales)
		FROM shift_cash sc
		WHERE s.id = sc.shift_id
	`
	tag, err := r.pool.Exec(ctx, query)
	return tag.RowsAffected(), err
}
