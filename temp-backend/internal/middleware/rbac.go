package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// RequireRole returns middleware that restricts access to users with the specified role.
func RequireRole(role domain.UserRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims := GetUserClaims(c)
		if claims.Role != role {
			respondError(c, http.StatusForbidden, "FORBIDDEN", "Insufficient permissions")
			c.Abort()
			return
		}
		c.Next()
	}
}
