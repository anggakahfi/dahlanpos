package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type userRepo struct {
	pool *pgxpool.Pool
}

// NewUserRepo creates a concrete UserRepository backed by PostgreSQL.
func NewUserRepo(pool *pgxpool.Pool) *userRepo {
	return &userRepo{pool: pool}
}

func (r *userRepo) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var u domain.User
	err := r.pool.QueryRow(ctx,
		`SELECT id, outlet_id, name, email, role, status, created_at, updated_at
		 FROM users WHERE email = $1`, email,
	).Scan(&u.ID, &u.OutletID, &u.Name, &u.Email, &u.Role, &u.Status, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *userRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	var u domain.User
	err := r.pool.QueryRow(ctx,
		`SELECT id, outlet_id, name, email, role, status, created_at, updated_at
		 FROM users WHERE id = $1`, id,
	).Scan(&u.ID, &u.OutletID, &u.Name, &u.Email, &u.Role, &u.Status, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *userRepo) FindAll(ctx context.Context) ([]domain.User, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, outlet_id, name, email, role, status, created_at, updated_at
		 FROM users ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []domain.User
	for rows.Next() {
		var u domain.User
		if err := rows.Scan(&u.ID, &u.OutletID, &u.Name, &u.Email, &u.Role, &u.Status, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, rows.Err()
}

func (r *userRepo) Create(ctx context.Context, user *domain.User) error {
	return r.pool.QueryRow(ctx,
		`INSERT INTO users (name, email, role, outlet_id, status)
		 VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at`,
		user.Name, user.Email, user.Role, user.OutletID, user.Status,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

func (r *userRepo) Update(ctx context.Context, user *domain.User) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE users SET name=$1, email=$2, role=$3, outlet_id=$4, status=$5 WHERE id=$6`,
		user.Name, user.Email, user.Role, user.OutletID, user.Status, user.ID,
	)
	return err
}

func (r *userRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.UserStatus) error {
	_, err := r.pool.Exec(ctx, `UPDATE users SET status=$1 WHERE id=$2`, status, id)
	return err
}

func (r *userRepo) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM users WHERE id=$1`, id)
	return err
}
