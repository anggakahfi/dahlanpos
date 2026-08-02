package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

type modifierRepo struct {
	pool *pgxpool.Pool
}

func NewModifierRepo(pool *pgxpool.Pool) *modifierRepo {
	return &modifierRepo{pool: pool}
}

func (r *modifierRepo) FindAll(ctx context.Context) ([]domain.ModifierGroup, error) {
	rows, err := r.pool.Query(ctx, `SELECT id, name, required, created_at FROM modifier_groups ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []domain.ModifierGroup
	for rows.Next() {
		var g domain.ModifierGroup
		var createdAt interface{}
		if err := rows.Scan(&g.ID, &g.Name, &g.Required, &createdAt); err != nil {
			return nil, err
		}
		opts, err := r.loadOptions(ctx, g.ID)
		if err != nil {
			return nil, err
		}
		g.Options = opts
		groups = append(groups, g)
	}
	return groups, rows.Err()
}

func (r *modifierRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.ModifierGroup, error) {
	var g domain.ModifierGroup
	var createdAt interface{}
	err := r.pool.QueryRow(ctx, `SELECT id, name, required, created_at FROM modifier_groups WHERE id=$1`, id).
		Scan(&g.ID, &g.Name, &g.Required, &createdAt)
	if err != nil {
		return nil, err
	}
	g.Options, err = r.loadOptions(ctx, g.ID)
	if err != nil {
		return nil, err
	}
	return &g, nil
}

func (r *modifierRepo) FindByIDs(ctx context.Context, ids []uuid.UUID) ([]domain.ModifierGroup, error) {
	var groups []domain.ModifierGroup
	for _, id := range ids {
		g, err := r.FindByID(ctx, id)
		if err != nil {
			return nil, err
		}
		groups = append(groups, *g)
	}
	return groups, nil
}

func (r *modifierRepo) Create(ctx context.Context, group *domain.ModifierGroup) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	err = tx.QueryRow(ctx,
		`INSERT INTO modifier_groups (name, required) VALUES ($1, $2) RETURNING id`,
		group.Name, group.Required,
	).Scan(&group.ID)
	if err != nil {
		return err
	}

	for i, opt := range group.Options {
		err = tx.QueryRow(ctx,
			`INSERT INTO modifier_options (modifier_group_id, name, price_impact, sort_order)
			 VALUES ($1, $2, $3, $4) RETURNING id`,
			group.ID, opt.Name, opt.PriceImpact, i,
		).Scan(&group.Options[i].ID)
		if err != nil {
			return err
		}
		group.Options[i].ModifierGroupID = group.ID
	}
	return tx.Commit(ctx)
}

func (r *modifierRepo) Update(ctx context.Context, group *domain.ModifierGroup) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, `UPDATE modifier_groups SET name=$1, required=$2 WHERE id=$3`,
		group.Name, group.Required, group.ID)
	if err != nil {
		return err
	}

	// Replace options: delete old, insert new
	_, err = tx.Exec(ctx, `DELETE FROM modifier_options WHERE modifier_group_id=$1`, group.ID)
	if err != nil {
		return err
	}

	for i, opt := range group.Options {
		err = tx.QueryRow(ctx,
			`INSERT INTO modifier_options (modifier_group_id, name, price_impact, sort_order)
			 VALUES ($1, $2, $3, $4) RETURNING id`,
			group.ID, opt.Name, opt.PriceImpact, i,
		).Scan(&group.Options[i].ID)
		if err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}

func (r *modifierRepo) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM modifier_groups WHERE id=$1`, id)
	return err
}

func (r *modifierRepo) loadOptions(ctx context.Context, groupID uuid.UUID) ([]domain.ModifierOption, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, modifier_group_id, name, price_impact, sort_order
		 FROM modifier_options WHERE modifier_group_id=$1 ORDER BY sort_order`, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var opts []domain.ModifierOption
	for rows.Next() {
		var o domain.ModifierOption
		if err := rows.Scan(&o.ID, &o.ModifierGroupID, &o.Name, &o.PriceImpact, &o.SortOrder); err != nil {
			return nil, err
		}
		opts = append(opts, o)
	}
	return opts, rows.Err()
}
