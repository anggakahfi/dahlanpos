package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it. Relying on system env vars.")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer pool.Close()

	fmt.Println("🚀 Resetting operational data...")

	// Truncate tables with CASCADE to ensure related records are cleared
	query := `
		TRUNCATE TABLE transaction_items CASCADE;
		TRUNCATE TABLE transactions CASCADE;
		TRUNCATE TABLE shifts CASCADE;
		TRUNCATE TABLE activity_logs CASCADE;
	`

	_, err = pool.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("❌ Error truncating tables: %v\n", err)
	}

	fmt.Println("✅ Operational data cleared successfully!")
	fmt.Println("   [Cleared]: shifts, transactions, transaction_items, activity_logs.")
	fmt.Println("   [Intact]: outlets, users, categories, modifier_groups, products.")
}
