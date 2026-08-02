package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
)

// UserClaims represents the JWT payload stored in Gin context.
type UserClaims struct {
	UserID   uuid.UUID       `json:"user_id"`
	Email    string          `json:"email"`
	Role     domain.UserRole `json:"role"`
	OutletID *uuid.UUID      `json:"outlet_id,omitempty"`
}

// respondError is a local helper to avoid importing the handler package (which would cause an import cycle).
func respondError(c *gin.Context, status int, code, message string) {
	c.JSON(status, gin.H{
		"success": false,
		"error":   gin.H{"code": code, "message": message},
	})
}

// AuthMiddleware validates Bearer JWT tokens and injects UserClaims into context.
func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			respondError(c, http.StatusUnauthorized, "UNAUTHORIZED", "Missing or invalid authorization header")
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			respondError(c, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid or expired token")
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			respondError(c, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid token claims")
			c.Abort()
			return
		}

		// BUG-17 FIX: Use safe type assertions to prevent panic on tampered tokens
		userIDStr, ok := claims["user_id"].(string)
		if !ok {
			respondError(c, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid token: missing user_id")
			c.Abort()
			return
		}
		roleStr, ok := claims["role"].(string)
		if !ok {
			respondError(c, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid token: missing role")
			c.Abort()
			return
		}
		emailStr, ok := claims["email"].(string)
		if !ok {
			respondError(c, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid token: missing email")
			c.Abort()
			return
		}

		userID, _ := uuid.Parse(userIDStr)
		role := domain.UserRole(roleStr)

		uc := UserClaims{
			UserID: userID,
			Email:  emailStr,
			Role:   role,
		}

		if outletStr, ok := claims["outlet_id"].(string); ok && outletStr != "" {
			oid, _ := uuid.Parse(outletStr)
			uc.OutletID = &oid
		}

		c.Set("user", uc)
		c.Next()
	}
}

// GetUserClaims extracts UserClaims from the Gin context.
func GetUserClaims(c *gin.Context) UserClaims {
	val, _ := c.Get("user")
	return val.(UserClaims)
}
