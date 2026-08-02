package config

import (
	"os"
	"strconv"
)

// Config holds all application configuration sourced from environment variables.
type Config struct {
	Port           string
	DatabaseURL    string
	JWTSecret      string
	GoogleClientID string
	ResendAPIKey   string
	CORSOrigin     string
	CloudinaryURL  string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() *Config {
	return &Config{
		Port:           getEnv("PORT", "8080"),
		DatabaseURL:    getEnv("DATABASE_URL", "postgres://root:password123@127.0.0.1:5433/smallthings_db?sslmode=disable"),
		JWTSecret:      getEnv("JWT_SECRET", "super-secret-dev-key-change-in-prod"),
		GoogleClientID: getEnv("GOOGLE_CLIENT_ID", ""),
		ResendAPIKey:   getEnv("RESEND_API_KEY", ""),
		CORSOrigin:     getEnv("CORS_ORIGIN", "http://localhost:3000"),
		CloudinaryURL:  getEnv("CLOUDINARY_URL", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// GetEnvInt reads an integer from environment variables.
func GetEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.Atoi(v); err == nil {
			return i
		}
	}
	return fallback
}
