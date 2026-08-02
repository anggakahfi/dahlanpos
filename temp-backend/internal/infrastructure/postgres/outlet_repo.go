package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type outletRepo struct {
	pool *pgxpool.Pool
}

func NewOutletRepo(pool *pgxpool.Pool) *outletRepo {
	return &outletRepo{pool: pool}
}

func (r *outletRepo) FindAll(ctx context.Context) ([]domain.Outlet, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT o.id, o.name, COALESCE(o.address, '') as address, COALESCE(o.phone, '') as phone, COALESCE(o.email, '') as email, COALESCE(o.open_time::text, '') as open_time, COALESCE(o.close_time::text, '') as close_time, o.status, o.created_at, COALESCE(o.updated_at, o.created_at) as updated_at,
		 (SELECT COUNT(*) FROM users u WHERE u.outlet_id = o.id) as employee_count
		 FROM outlets o ORDER BY o.name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var outlets []domain.Outlet
	for rows.Next() {
		var o domain.Outlet
		if err := rows.Scan(&o.ID, &o.Name, &o.Address, &o.Phone, &o.Email, &o.OpenTime, &o.CloseTime, &o.Status, &o.CreatedAt, &o.UpdatedAt, &o.EmployeeCount); err != nil {
			return nil, err
		}
		outlets = append(outlets, o)
	}
	return outlets, rows.Err()
}

func (r *outletRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Outlet, error) {
	var o domain.Outlet
	err := r.pool.QueryRow(ctx,
		`SELECT o.id, o.name, COALESCE(o.address, '') as address, COALESCE(o.phone, '') as phone, COALESCE(o.email, '') as email, COALESCE(o.open_time::text, '') as open_time, COALESCE(o.close_time::text, '') as close_time, o.status, o.created_at, COALESCE(o.updated_at, o.created_at) as updated_at,
		 (SELECT COUNT(*) FROM users u WHERE u.outlet_id = o.id) as employee_count
		 FROM outlets o WHERE o.id = $1`, id,
	).Scan(&o.ID, &o.Name, &o.Address, &o.Phone, &o.Email, &o.OpenTime, &o.CloseTime, &o.Status, &o.CreatedAt, &o.UpdatedAt, &o.EmployeeCount)
	if err != nil {
		return nil, err
	}
	return &o, nil
}

func (r *outletRepo) Create(ctx context.Context, outlet *domain.Outlet) error {
	return r.pool.QueryRow(ctx,
		`INSERT INTO outlets (name, address, phone, email, open_time, close_time)
		 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at`,
		outlet.Name, outlet.Address, outlet.Phone, outlet.Email, outlet.OpenTime, outlet.CloseTime,
	).Scan(&outlet.ID, &outlet.CreatedAt, &outlet.UpdatedAt)
}

func (r *outletRepo) Update(ctx context.Context, outlet *domain.Outlet) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE outlets SET name=$1, address=$2, phone=$3, email=$4, open_time=$5, close_time=$6 WHERE id=$7`,
		outlet.Name, outlet.Address, outlet.Phone, outlet.Email, outlet.OpenTime, outlet.CloseTime, outlet.ID,
	)
	return err
}

func (r *outletRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.OutletStatus) error {
	_, err := r.pool.Exec(ctx, `UPDATE outlets SET status=$1 WHERE id=$2`, status, id)
	return err
}

func (r *outletRepo) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM outlets WHERE id=$1`, id)
	return err
}
