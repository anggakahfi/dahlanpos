package main

import (
	"context"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/infrastructure/postgres"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

func main() {
	pool, err := pgxpool.New(context.Background(), "postgres://root:password123@localhost:5433/smallthings_db?sslmode=disable")
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer pool.Close()

	repo := postgres.NewProductRepo(pool)

	// Create a category
	catID := uuid.New()
	_, err = pool.Exec(context.Background(), "INSERT INTO categories (id, name) VALUES ($1, $2)", catID, "Test Category")
	if err != nil {
		log.Printf("Cat err: %v", err)
	}

	// Create a product
	p := domain.Product{
		CategoryID:        &catID,
		Name:              "Test item",
		Price:             15000,
		Stock:             10,
		Unit:              domain.UnitCup,
		LowStockThreshold: 5,
		IsActive:          true,
	}

	err = repo.Create(context.Background(), &p)
	if err != nil {
		fmt.Printf("Error creating product: %v\n", err)
		return
	}

	fmt.Printf("Product created with ID: %v\n", p.ID)

	// Fetch products
	products, total, err := repo.FindAll(context.Background(), repository.ProductFilter{})
	if err != nil {
		fmt.Printf("Error finding products: %v\n", err)
		return
	}

	fmt.Printf("Total products found: %d\n", total)
	for _, pr := range products {
		fmt.Printf("- %s (Cat: %s)\n", pr.Name, pr.CategoryName)
	}
}
