//go:build integration

package integration_test

import (
	"context"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// TestIntegration_Auth_LoginOAuth_Success validates the end-to-End login flow.
// It uses a development bypass where passing an email as the id_token simulates successful OAuth authentication.
func TestIntegration_Auth_LoginOAuth_Success(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	// Persiapkan user valid di DB
	outletID := InsertOutlet(t, "Pusat")
	InsertUser(t, "owner@test.com", domain.RoleOwner, &outletID)

	// Login menggunakan dev bypass. Di dev bypass, jika client id kosong, id_token dianggap raw email.
	payload := `{"provider": "google", "id_token": "owner@test.com"}`
	w := DoRequest(t, router, "POST", "/api/v1/auth/login/oauth", payload, "")

	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data struct {
			Token string `json:"token"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
	assert.NotEmpty(t, resp.Data.Token, "Token tidak boleh kosong jika login berhasil")
}

// TestIntegration_Auth_LoginOAuth_Unregistered validates that an email not present
// in the database will be rejected with a 403 Forbidden status during login.
func TestIntegration_Auth_LoginOAuth_Unregistered(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	// Login menggunakan email yang tidak ada di DB
	payload := `{"provider": "google", "id_token": "penyusup@test.com"}`
	w := DoRequest(t, router, "POST", "/api/v1/auth/login/oauth", payload, "")

	// Handler returns 403 (ACCESS_DENIED) for unregistered users
	assert.Equal(t, http.StatusForbidden, w.Code)
}

// TestIntegration_Auth_LoginOAuth_InactiveUser validates that users explicitly 
// marked as 'inactive' in the database cannot obtain an authorization token.
func TestIntegration_Auth_LoginOAuth_InactiveUser(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	// Insert user lalu ubah status secara manual jadi inactive
	outletID := InsertOutlet(t, "Cabang")
	userID := InsertUser(t, "kasir_pecat@test.com", domain.RoleCashier, &outletID)

	_, err := testDB.Exec(context.Background(), "UPDATE users SET status = 'inactive' WHERE id = $1", userID)
	require.NoError(t, err)

	payload := `{"provider": "google", "id_token": "kasir_pecat@test.com"}`
	w := DoRequest(t, router, "POST", "/api/v1/auth/login/oauth", payload, "")

	// Handler returns 403 (ACCESS_DENIED) for inactive users
	assert.Equal(t, http.StatusForbidden, w.Code)
}
