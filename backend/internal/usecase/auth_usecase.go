package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

// AuthUsecase handles authentication logic.
type AuthUsecase struct {
	userRepo  repository.UserRepository
	logRepo   repository.ActivityLogRepository
	jwtSecret string
}

// NewAuthUsecase creates a new AuthUsecase.
func NewAuthUsecase(ur repository.UserRepository, lr repository.ActivityLogRepository, secret string) *AuthUsecase {
	return &AuthUsecase{userRepo: ur, logRepo: lr, jwtSecret: secret}
}

// AuthResponse is the result of a successful login.
type AuthResponse struct {
	Token     string       `json:"token"`
	ExpiresAt time.Time    `json:"expires_at"`
	User      *domain.User `json:"user"`
}

// LoginWithOAuth authenticates a user by email (extracted from Google ID token).
// In production, the caller must verify the Google ID token first and extract the email.
func (uc *AuthUsecase) LoginWithOAuth(ctx context.Context, email string) (*AuthResponse, error) {
	user, err := uc.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil, errors.New("email tidak terdaftar di sistem")
	}

	if user.Status != domain.StatusActive {
		return nil, errors.New("akun anda dinonaktifkan, hubungi owner")
	}

	// Generate JWT
	expiresAt := time.Now().Add(24 * time.Hour)
	claims := jwt.MapClaims{
		"user_id": user.ID.String(),
		"email":   user.Email,
		"role":    string(user.Role),
		"exp":     expiresAt.Unix(),
	}
	if user.OutletID != nil {
		claims["outlet_id"] = user.OutletID.String()
	} else {
		claims["outlet_id"] = ""
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(uc.jwtSecret))
	if err != nil {
		return nil, err
	}

	// Log activity
	_ = uc.logRepo.Create(ctx, &domain.ActivityLog{
		UserID:       user.ID,
		OutletID:     user.OutletID,
		ActivityType: domain.ActivityLogin,
		Details:      "OAuth login via Google",
	})

	return &AuthResponse{Token: tokenStr, ExpiresAt: expiresAt, User: user}, nil
}
