package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/middleware"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

type AuthHandler struct {
	authUC  *usecase.AuthUsecase
	logRepo repository.ActivityLogRepository
}

func NewAuthHandler(uc *usecase.AuthUsecase, lr repository.ActivityLogRepository) *AuthHandler {
	return &AuthHandler{authUC: uc, logRepo: lr}
}

type loginRequest struct {
	Provider string `json:"provider" binding:"required"`
	IDToken  string `json:"id_token" binding:"required"`
}

func (h *AuthHandler) LoginOAuth(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}

	// For production, we pass the id_token directly to usecase for validation.
	idToken := req.IDToken

	resp, err := h.authUC.LoginWithOAuth(c.Request.Context(), idToken)
	if err != nil {
		RespondError(c, http.StatusForbidden, "ACCESS_DENIED", err.Error())
		return
	}

	RespondSuccess(c, http.StatusOK, resp)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// Log the logout activity so it appears in the activity log
	claims := middleware.GetUserClaims(c)
	_ = h.logRepo.Create(c.Request.Context(), &domain.ActivityLog{
		UserID:       claims.UserID,
		OutletID:     claims.OutletID,
		ActivityType: domain.ActivityLogout,
		Details:      "User logged out",
	})

	// In a stateless JWT system, logout is client-side (discard token).
	RespondSuccess(c, http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func (h *AuthHandler) RegisterPublicRoutes(rg *gin.RouterGroup) {
	auth := rg.Group("/auth")
	auth.POST("/login/oauth", h.LoginOAuth)
}

func (h *AuthHandler) RegisterProtectedRoutes(rg *gin.RouterGroup) {
	auth := rg.Group("/auth")
	auth.POST("/logout", h.Logout)
}

