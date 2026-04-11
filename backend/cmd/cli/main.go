package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/smallthingscoffee/pos-backend/internal/config"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/infrastructure/postgres"
)

func main() {
	if len(os.Args) < 4 {
		fmt.Println("Usage: go run ./cmd/cli add-owner <name> <email>")
		os.Exit(1)
	}

	command := os.Args[1]
	name := os.Args[2]
	email := os.Args[3]

	if command != "add-owner" {
		fmt.Printf("Unknown command: %s\n", command)
		os.Exit(1)
	}

	_ = godotenv.Load() // Load .env file if it exists
	cfg := config.Load()
	pool, err := postgres.NewConnection(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}
	defer pool.Close()

	userRepo := postgres.NewUserRepo(pool)

	// Check if already exists
	existing, _ := userRepo.FindByEmail(context.Background(), email)
	if existing != nil {
		fmt.Printf("⚠️ User with email %s already exists!\n", email)
		os.Exit(1)
	}

	owner := &domain.User{
		Name:   name,
		Email:  email,
		Role:   domain.RoleOwner,
		Status: domain.StatusActive,
	}

	err = userRepo.Create(context.Background(), owner)
	if err != nil {
		log.Fatalf("❌ Failed to create owner: %v", err)
	}

	fmt.Println("✅ Owner berhasil ditambahkan!")
	fmt.Printf("   ID    : %s\n", owner.ID)
	fmt.Printf("   Nama  : %s\n", owner.Name)
	fmt.Printf("   Email : %s\n", owner.Email)
	fmt.Printf("   Role  : %s\n", owner.Role)
}
