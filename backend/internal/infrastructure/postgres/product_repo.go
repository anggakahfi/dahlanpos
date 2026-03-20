package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type productRepo struct {
	pool *pgxpool.Pool
}

func NewProductRepo(pool *pgxpool.Pool) *productRepo {
	return &productRepo{pool: pool}
}

func (r *productRepo) FindAll(ctx context.Context, filter repository.ProductFilter) ([]domain.Product, int64, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	if filter.CategoryID != nil {
		conditions = append(conditions, fmt.Sprintf("p.category_id = $%d", argIdx))
		args = append(args, *filter.CategoryID)
		argIdx++
	}
	if filter.Search != "" {
		conditions = append(conditions, fmt.Sprintf("p.name ILIKE $%d", argIdx))
		args = append(args, "%"+filter.Search+"%")
		argIdx++
	}
	if filter.IsActive != nil {
		conditions = append(conditions, fmt.Sprintf("p.is_active = $%d", argIdx))
		args = append(args, *filter.IsActive)
		argIdx++
	}

	where := ""
	if len(conditions) > 0 {
		where = "WHERE " + strings.Join(conditions, " AND ")
	}

	// Count total
	var total int64
	countSQL := fmt.Sprintf("SELECT COUNT(*) FROM products p %s", where)
	if err := r.pool.QueryRow(ctx, countSQL, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	// Paginate
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
		`SELECT p.id, p.category_id, p.name, p.price, p.stock, p.unit, p.low_stock_threshold,
		        COALESCE(p.description, '') as description, COALESCE(p.image_url, '') as image_url, p.is_active, p.is_favorite, p.created_at, p.updated_at,
		        COALESCE(c.name, '') as category_name
		 FROM products p LEFT JOIN categories c ON p.category_id = c.id
		 %s ORDER BY p.name LIMIT $%d OFFSET $%d`, where, argIdx, argIdx+1)
	args = append(args, perPage, offset)

	rows, err := r.pool.Query(ctx, dataSQL, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var products []domain.Product
	for rows.Next() {
		var p domain.Product
		if err := rows.Scan(
			&p.ID, &p.CategoryID, &p.Name, &p.Price, &p.Stock, &p.Unit, &p.LowStockThreshold,
			&p.Description, &p.ImageURL, &p.IsActive, &p.IsFavorite, &p.CreatedAt, &p.UpdatedAt,
			&p.CategoryName,
		); err != nil {
			return nil, 0, err
		}
		products = append(products, p)
	}
	return products, total, rows.Err()
}

func (r *productRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	var p domain.Product
	err := r.pool.QueryRow(ctx,
		`SELECT p.id, p.category_id, p.name, p.price, p.stock, p.unit, p.low_stock_threshold,
		        COALESCE(p.description, '') as description, COALESCE(p.image_url, '') as image_url, p.is_active, p.is_favorite, p.created_at, p.updated_at,
		        COALESCE(c.name, '') as category_name
		 FROM products p LEFT JOIN categories c ON p.category_id = c.id
		 WHERE p.id = $1`, id,
	).Scan(
		&p.ID, &p.CategoryID, &p.Name, &p.Price, &p.Stock, &p.Unit, &p.LowStockThreshold,
		&p.Description, &p.ImageURL, &p.IsActive, &p.IsFavorite, &p.CreatedAt, &p.UpdatedAt,
		&p.CategoryName,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *productRepo) FindActiveWithModifiers(ctx context.Context) ([]domain.Product, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT p.id, p.category_id, p.name, p.price, p.stock, p.unit, p.low_stock_threshold,
		        COALESCE(p.description, '') as description, COALESCE(p.image_url, '') as image_url, p.is_active, p.is_favorite, p.created_at, p.updated_at,
		        COALESCE(c.name, '') as category_name
		 FROM products p LEFT JOIN categories c ON p.category_id = c.id
		 WHERE p.is_active = true ORDER BY p.name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []domain.Product
	for rows.Next() {
		var p domain.Product
		if err := rows.Scan(
			&p.ID, &p.CategoryID, &p.Name, &p.Price, &p.Stock, &p.Unit, &p.LowStockThreshold,
			&p.Description, &p.ImageURL, &p.IsActive, &p.IsFavorite, &p.CreatedAt, &p.UpdatedAt,
			&p.CategoryName,
		); err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Load modifier group IDs for each product
	for i := range products {
		ids, err := r.GetModifierGroupIDs(ctx, products[i].ID)
		if err != nil {
			return nil, err
		}
		products[i].ModifierGroupIDs = ids
	}
	return products, nil
}

func (r *productRepo) Create(ctx context.Context, product *domain.Product) error {
	return r.pool.QueryRow(ctx,
		`INSERT INTO products (category_id, name, price, stock, unit, low_stock_threshold, description, image_url, is_active, is_favorite)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, created_at, updated_at`,
		product.CategoryID, product.Name, product.Price, product.Stock, product.Unit,
		product.LowStockThreshold, product.Description, product.ImageURL, product.IsActive, product.IsFavorite,
	).Scan(&product.ID, &product.CreatedAt, &product.UpdatedAt)
}

func (r *productRepo) Update(ctx context.Context, product *domain.Product) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE products SET category_id=$1, name=$2, price=$3, stock=$4, unit=$5,
		 low_stock_threshold=$6, description=$7, image_url=$8, is_active=$9, is_favorite=$10
		 WHERE id=$11`,
		product.CategoryID, product.Name, product.Price, product.Stock, product.Unit,
		product.LowStockThreshold, product.Description, product.ImageURL, product.IsActive, product.IsFavorite, product.ID,
	)
	return err
}

func (r *productRepo) UpdateStock(ctx context.Context, id uuid.UUID, delta int) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE products SET stock = stock + $1 WHERE id = $2 AND stock + $1 >= 0`,
		delta, id,
	)
	return err
}

func (r *productRepo) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM products WHERE id=$1`, id)
	return err
}

func (r *productRepo) SetModifierGroups(ctx context.Context, productID uuid.UUID, groupIDs []uuid.UUID) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, `DELETE FROM product_modifier_groups WHERE product_id=$1`, productID)
	if err != nil {
		return err
	}

	for _, gid := range groupIDs {
		_, err = tx.Exec(ctx,
			`INSERT INTO product_modifier_groups (product_id, modifier_group_id) VALUES ($1, $2)`,
			productID, gid,
		)
		if err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}

func (r *productRepo) GetModifierGroupIDs(ctx context.Context, productID uuid.UUID) ([]uuid.UUID, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT modifier_group_id FROM product_modifier_groups WHERE product_id=$1`, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ids []uuid.UUID
	for rows.Next() {
		var id uuid.UUID
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, rows.Err()
}
