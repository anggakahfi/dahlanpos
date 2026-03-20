package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

type AuthHandler struct {
	authUC *usecase.AuthUsecase
}

func NewAuthHandler(uc *usecase.AuthUsecase) *AuthHandler {
	return &AuthHandler{authUC: uc}
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

	// TODO: In production, verify Google ID Token and extract email.
	// For development, we use the id_token AS the email directly.
	email := req.IDToken

	resp, err := h.authUC.LoginWithOAuth(c.Request.Context(), email)
	if err != nil {
		RespondError(c, http.StatusForbidden, "ACCESS_DENIED", err.Error())
		return
	}

	RespondSuccess(c, http.StatusOK, resp)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// In a stateless JWT system, logout is client-side (discard token).
	// If blacklisting is needed, implement a token store here.
	RespondSuccess(c, http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func (h *AuthHandler) RegisterRoutes(rg *gin.RouterGroup) {
	auth := rg.Group("/auth")
	auth.POST("/login/oauth", h.LoginOAuth)
	auth.POST("/logout", h.Logout)
}
