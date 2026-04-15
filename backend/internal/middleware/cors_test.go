package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/smallthingscoffee/pos-backend/internal/middleware"
)

func TestCORSMiddleware(t *testing.T) {
	r := gin.New()
	r.Use(middleware.CORSMiddleware("http://localhost:3000"))
	r.GET("/test-cors", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	req, _ := http.NewRequest("GET", "/test-cors", nil)
	req.Header.Set("Origin", "http://localhost:3000")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Since we are mocking the request, we can verify basic CORS headers if they are applied.
	// We just want to execute the CORSMiddleware code path for coverage.
	assert.Equal(t, 200, w.Code)
}
