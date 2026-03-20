.PHONY: run build migrate-up migrate-down docker-build

# Run the dev server
run:
	go run ./cmd/server/main.go

# Build production binary
build:
	CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o ./bin/server ./cmd/server/main.go

# Database migrations
migrate-up:
	migrate -path db/migrations -database "$(DATABASE_URL)" up

migrate-down:
	migrate -path db/migrations -database "$(DATABASE_URL)" down 1

# Docker
docker-build:
	docker build -t smallthings-backend .
