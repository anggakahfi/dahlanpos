package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/middleware"
)

func setupRBACRouter(requiredRole domain.UserRole) *gin.Engine {
	r := gin.New()
	r.Use(middleware.AuthMiddleware(testSecret))
	r.Use(middleware.RequireRole(requiredRole))
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "access granted"})
	})
	return r
}

func makeRBACRequest(role string) (*httptest.ResponseRecorder, *http.Request) {
	claims := jwt.MapClaims{
		"user_id":   uuid.New().String(),
		"email":     "test@test.com",
		"role":      role,
		"outlet_id": uuid.New().String(),
		"exp":       time.Now().Add(time.Hour).Unix(),
	}
	token := makeToken(claims)

	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	return httptest.NewRecorder(), req
}

// ─── RequireRole ───────────────────────────────────────────────

func TestRBAC_OwnerAccessOwnerEndpoint(t *testing.T) {
	r := setupRBACRouter(domain.RoleOwner)
	w, req := makeRBACRequest("owner")
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Contains(t, w.Body.String(), "access granted")
}

func TestRBAC_CashierAccessOwnerEndpoint_Forbidden(t *testing.T) {
	r := setupRBACRouter(domain.RoleOwner)
	w, req := makeRBACRequest("cashier")
	r.ServeHTTP(w, req)

	assert.Equal(t, 403, w.Code)
}

func TestRBAC_CashierAccessCashierEndpoint(t *testing.T) {
	r := setupRBACRouter(domain.RoleCashier)
	w, req := makeRBACRequest("cashier")
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Contains(t, w.Body.String(), "access granted")
}

func TestRBAC_OwnerAccessCashierEndpoint_Forbidden(t *testing.T) {
	r := setupRBACRouter(domain.RoleCashier)
	w, req := makeRBACRequest("owner")
	r.ServeHTTP(w, req)

	assert.Equal(t, 403, w.Code)
}
