//go:build integration

package integration_test

import (
	"context"
	"io"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/stretchr/testify/require"
)

// InsertOutlet is a test helper that directly inserts an outlet record into the database
// and returns its generated UUID.
func InsertOutlet(t *testing.T, name string) uuid.UUID {
	t.Helper()
	var id uuid.UUID
	err := testDB.QueryRow(context.Background(),
		`INSERT INTO outlets (name, status) VALUES ($1, 'active') RETURNING id`, name,
	).Scan(&id)
	require.NoError(t, err)
	return id
}

// InsertUser is a test helper that injects a predefined user with a specific role
// and automatically assigns them to an outlet if provided. Returns the user's UUID.
func InsertUser(t *testing.T, email string, role domain.UserRole, outletID *uuid.UUID) uuid.UUID {
	t.Helper()
	var id uuid.UUID
	err := testDB.QueryRow(context.Background(),
		`INSERT INTO users (name, email, role, outlet_id, status)
		 VALUES ($1, $2, $3, $4, 'active') RETURNING id`,
		email, email, role, outletID,
	).Scan(&id)
	require.NoError(t, err)
	return id
}

// InsertProduct is a test helper that seeds the database with a product entry.
// It initializes the product as active with a specific stock and category.
func InsertProduct(t *testing.T, name string, price float64, stock int, categoryID *uuid.UUID) uuid.UUID {
	t.Helper()
	var id uuid.UUID
	err := testDB.QueryRow(context.Background(),
		`INSERT INTO products (name, price, stock, unit, is_active, category_id)
		 VALUES ($1, $2, $3, 'pcs', true, $4) RETURNING id`,
		name, price, stock, categoryID,
	).Scan(&id)
	require.NoError(t, err)
	return id
}

// InsertShift starts a simulated shift for a user at an outlet.
// The time is set to current testing time and returns the shift UUID.
func InsertShift(t *testing.T, userID uuid.UUID, outletID uuid.UUID, startingCash float64) uuid.UUID {
	t.Helper()
	var id uuid.UUID
	err := testDB.QueryRow(context.Background(),
		`INSERT INTO shifts (user_id, outlet_id, started_at, starting_cash, expected_cash)
		 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		userID, outletID, time.Now(), startingCash, startingCash,
	).Scan(&id)
	require.NoError(t, err)
	return id
}

// InsertCategory creates a product category directly via database insertion.
func InsertCategory(t *testing.T, name string) uuid.UUID {
	t.Helper()
	var id uuid.UUID
	err := testDB.QueryRow(context.Background(),
		`INSERT INTO categories (name) VALUES ($1) RETURNING id`, name,
	).Scan(&id)
	require.NoError(t, err)
	return id
}

// InsertModifierGroup creates a modifier group directly via database insertion.
func InsertModifierGroup(t *testing.T, name string, required bool) uuid.UUID {
	t.Helper()
	var id uuid.UUID
	err := testDB.QueryRow(context.Background(),
		`INSERT INTO modifier_groups (name, required) VALUES ($1, $2) RETURNING id`, name, required,
	).Scan(&id)
	require.NoError(t, err)
	return id
}

// InsertModifierOption attaches a new option (e.g. Size: Large) to an existing ModifierGroup.
func InsertModifierOption(t *testing.T, groupID uuid.UUID, name string, priceImpact float64) uuid.UUID {
	t.Helper()
	var id uuid.UUID
	err := testDB.QueryRow(context.Background(),
		`INSERT INTO modifier_options (modifier_group_id, name, price_impact) VALUES ($1, $2, $3) RETURNING id`, groupID, name, priceImpact,
	).Scan(&id)
	require.NoError(t, err)
	return id
}

// LinkProductModifier attaches an existing modifier group to a specific product
// to simulate product variations during checkout flow tests.
func LinkProductModifier(t *testing.T, productID, groupID uuid.UUID) {
	t.Helper()
	_, err := testDB.Exec(context.Background(),
		`INSERT INTO product_modifier_groups (product_id, modifier_group_id) VALUES ($1, $2)`, productID, groupID,
	)
	require.NoError(t, err)
}

// MakeAuthToken generates a valid signed JWT token for integration tests.
// The token maps realistic user claims and validates against the application's auth middleware.
func MakeAuthToken(t *testing.T, userID uuid.UUID, email string, role domain.UserRole, outletID *uuid.UUID) string {
	t.Helper()
	claims := jwt.MapClaims{
		"user_id": userID.String(),
		"email":   email,
		"role":    string(role),
		"exp":     time.Now().Add(time.Hour).Unix(),
	}
	if outletID != nil {
		claims["outlet_id"] = outletID.String()
	} else {
		claims["outlet_id"] = ""
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	str, err := token.SignedString([]byte(JWTSecret))
	require.NoError(t, err)
	return str
}

// MakeTokenWithSecret membuat token yang di-sign dengan secret berbeda (untuk test tampered token).
func MakeTokenWithSecret(t *testing.T, wrongSecret string) string {
	t.Helper()
	claims := jwt.MapClaims{
		"user_id": uuid.New().String(),
		"email":   "hacker@test.com",
		"role":    "cashier",
		"exp":     time.Now().Add(time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	str, err := token.SignedString([]byte(wrongSecret))
	require.NoError(t, err)
	return str
}

// MakeExpiredToken membuat token yang sudah kadaluarsa (exp di masa lalu).
func MakeExpiredToken(t *testing.T) string {
	t.Helper()
	claims := jwt.MapClaims{
		"user_id": uuid.New().String(),
		"email":   "expired@test.com",
		"role":    "cashier",
		"exp":     time.Now().Add(-time.Hour).Unix(), // expired 1 jam lalu
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	str, err := token.SignedString([]byte(JWTSecret))
	require.NoError(t, err)
	return str
}

// DoRequest is a utility helper that initializes an HTTP request, injects Authorization headers,
// binds a JSON body if present, and dispatches the request to the provided Gin router instance.
// It returns the response recorder containing HTTP outcome and body assertions.
func DoRequest(t *testing.T, router *gin.Engine, method, path, body, token string) *httptest.ResponseRecorder {
	t.Helper()
	var reqBody io.Reader
	if body != "" {
		reqBody = strings.NewReader(body)
	}
	req := httptest.NewRequest(method, path, reqBody)
	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}
