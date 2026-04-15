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
	"github.com/smallthingscoffee/pos-backend/internal/middleware"
)

const testSecret = "test-secret-key-for-middleware"

func init() {
	gin.SetMode(gin.TestMode)
}

func makeToken(claims jwt.MapClaims) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	str, _ := token.SignedString([]byte(testSecret))
	return str
}

func validClaims() jwt.MapClaims {
	return jwt.MapClaims{
		"user_id":   uuid.New().String(),
		"email":     "test@test.com",
		"role":      "cashier",
		"outlet_id": uuid.New().String(),
		"exp":       time.Now().Add(time.Hour).Unix(),
	}
}

func setupRouter() *gin.Engine {
	r := gin.New()
	r.Use(middleware.AuthMiddleware(testSecret))
	r.GET("/test", func(c *gin.Context) {
		claims := middleware.GetUserClaims(c)
		c.JSON(200, gin.H{"user_id": claims.UserID.String(), "role": string(claims.Role)})
	})
	return r
}

// ─── AuthMiddleware ────────────────────────────────────────────

func TestAuth_ValidToken(t *testing.T) {
	r := setupRouter()
	token := makeToken(validClaims())

	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
}

func TestAuth_MissingHeader(t *testing.T) {
	r := setupRouter()

	req, _ := http.NewRequest("GET", "/test", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
}

func TestAuth_NoBearerPrefix(t *testing.T) {
	r := setupRouter()
	token := makeToken(validClaims())

	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", token) // no "Bearer " prefix
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
}

func TestAuth_ExpiredToken(t *testing.T) {
	r := setupRouter()
	claims := validClaims()
	claims["exp"] = time.Now().Add(-time.Hour).Unix() // expired
	token := makeToken(claims)

	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
}

func TestAuth_WrongSigningKey(t *testing.T) {
	r := setupRouter()
	// Sign with a completely different key
	claims := validClaims()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := token.SignedString([]byte("wrong-secret-key"))

	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
}

func TestAuth_MissingUserIDClaim(t *testing.T) {
	r := setupRouter()
	claims := jwt.MapClaims{
		"email": "test@test.com",
		"role":  "cashier",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}
	token := makeToken(claims)

	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
}

func TestAuth_MissingRoleClaim(t *testing.T) {
	r := setupRouter()
	claims := jwt.MapClaims{
		"user_id": uuid.New().String(),
		"email":   "test@test.com",
		"exp":     time.Now().Add(time.Hour).Unix(),
	}
	token := makeToken(claims)

	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 401, w.Code)
}

func TestAuth_ExtractsOutletID(t *testing.T) {
	r := gin.New()
	r.Use(middleware.AuthMiddleware(testSecret))
	r.GET("/test", func(c *gin.Context) {
		claims := middleware.GetUserClaims(c)
		if claims.OutletID != nil {
			c.JSON(200, gin.H{"outlet_id": claims.OutletID.String()})
		} else {
			c.JSON(200, gin.H{"outlet_id": ""})
		}
	})

	outletID := uuid.New()
	claims := validClaims()
	claims["outlet_id"] = outletID.String()
	token := makeToken(claims)

	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Contains(t, w.Body.String(), outletID.String())
}
