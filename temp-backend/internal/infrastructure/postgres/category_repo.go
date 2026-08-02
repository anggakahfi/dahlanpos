package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type categoryRepo struct {
	pool *pgxpool.Pool
}

func NewCategoryRepo(pool *pgxpool.Pool) *categoryRepo {
	return &categoryRepo{pool: pool}
}

func (r *categoryRepo) FindAll(ctx context.Context) ([]domain.Category, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, created_at FROM categories ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cats []domain.Category
	for rows.Next() {
		var c domain.Category
		if err := rows.Scan(&c.ID, &c.Name, &c.CreatedAt); err != nil {
			return nil, err
		}
		cats = append(cats, c)
	}
	return cats, rows.Err()
}

func (r *categoryRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Category, error) {
	var c domain.Category
	err := r.pool.QueryRow(ctx, `SELECT id, name, created_at FROM categories WHERE id=$1`, id).Scan(&c.ID, &c.Name, &c.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *categoryRepo) Create(ctx context.Context, cat *domain.Category) error {
	return r.pool.QueryRow(ctx,
		`INSERT INTO categories (name) VALUES ($1) RETURNING id, created_at`,
		cat.Name,
	).Scan(&cat.ID, &cat.CreatedAt)
}

func (r *categoryRepo) Update(ctx context.Context, cat *domain.Category) error {
	_, err := r.pool.Exec(ctx, `UPDATE categories SET name=$1 WHERE id=$2`, cat.Name, cat.ID)
	return err
}

func (r *categoryRepo) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM categories WHERE id=$1`, id)
	return err
}
