//go:build integration

package integration_test

import (
	"net/http"
	"testing"

	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/stretchr/testify/assert"
)

// TestIntegration_RBAC_CashierForbiddenFromBackoffice enforces that users with
// the Cashier role are properly rejected by the RBAC middleware when attempting
// to access backoffice-exclusive execution paths, returning a 403 Forbidden.
func TestIntegration_RBAC_CashierForbiddenFromBackoffice(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Outlet Kasir")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	endpoints := []string{
		"/api/v1/backoffice/employees",
		"/api/v1/backoffice/outlets",
		"/api/v1/backoffice/products",
		"/api/v1/backoffice/dashboard/summary",
	}

	for _, ep := range endpoints {
		t.Run("GET "+ep, func(t *testing.T) {
			w := DoRequest(t, router, "GET", ep, "", token)
			// RBAC Reject harusnya balikin 403 Forbidden
			assert.Equal(t, http.StatusForbidden, w.Code,
				"Kasir harus mendapat 403 di endpoint: %s", ep)
		})
	}
}

// TestIntegration_RBAC_OwnerCanAccessBackoffice enforces positive RBAC flow,
// ensuring the Owner role retains valid access permissions to all backoffice endpoints.
// This prevents blanket middleware bugs from blocking legitimate administration.
func TestIntegration_RBAC_OwnerCanAccessBackoffice(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	endpoints := []string{
		"/api/v1/backoffice/employees",
		"/api/v1/backoffice/outlets",
		"/api/v1/backoffice/products",
	}

	for _, ep := range endpoints {
		t.Run("GET "+ep, func(t *testing.T) {
			w := DoRequest(t, router, "GET", ep, "", token)
			assert.NotEqual(t, http.StatusForbidden, w.Code,
				"Owner tidak boleh mendapat 403 di endpoint: %s", ep)
			assert.NotEqual(t, http.StatusUnauthorized, w.Code,
				"Owner tidak boleh mendapat 401 di endpoint: %s", ep)
		})
	}
}

// TestIntegration_Auth_UnauthorizedWithoutToken ensures endpoints protected
// by the Auth middleware return 401 Unauthorized when no token is presented.
func TestIntegration_Auth_UnauthorizedWithoutToken(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	// Akses endpoint yg dilindungi tanpa token
	w := DoRequest(t, router, "GET", "/api/v1/cashier/menu", "", "") // no token
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// TestIntegration_Auth_InvalidSignature_Returns401 ensures that tampered JWTs,
// signed with an unauthorized secret key, are intercepted and rejected with 401.
func TestIntegration_Auth_InvalidSignature_Returns401(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	// Token di-sign dengan secret yang berbeda dari JWTSecret server
	tamperedToken := MakeTokenWithSecret(t, "wrong-secret-attacker-key")

	w := DoRequest(t, router, "GET", "/api/v1/cashier/menu", "", tamperedToken)
	assert.Equal(t, http.StatusUnauthorized, w.Code,
		"Token dengan signature salah harus mendapat 401")
}

// TestIntegration_Auth_ExpiredToken_Returns401 ensures structurally valid but
// temporally expired tokens are appropriately rejected by the authentication cycle.
func TestIntegration_Auth_ExpiredToken_Returns401(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	// Token dibuat dengan exp di masa lalu
	expiredToken := MakeExpiredToken(t)

	w := DoRequest(t, router, "GET", "/api/v1/cashier/menu", "", expiredToken)
	assert.Equal(t, http.StatusUnauthorized, w.Code,
		"Token expired harus mendapat 401")
}
