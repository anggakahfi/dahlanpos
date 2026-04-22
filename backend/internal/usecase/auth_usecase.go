package usecase

import (
	"context"
	"errors"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
	"google.golang.org/api/idtoken"
)

// AuthUsecase handles authentication logic.
type AuthUsecase struct {
	userRepo       repository.UserRepository
	logRepo        repository.ActivityLogRepository
	jwtSecret      string
	googleClientID string
}

// NewAuthUsecase creates a new AuthUsecase.
func NewAuthUsecase(ur repository.UserRepository, lr repository.ActivityLogRepository, secret, googleClientID string) *AuthUsecase {
	return &AuthUsecase{userRepo: ur, logRepo: lr, jwtSecret: secret, googleClientID: googleClientID}
}

// AuthResponse is the result of a successful login.
type AuthResponse struct {
	Token     string       `json:"token"`
	ExpiresAt time.Time    `json:"expires_at"`
	User      *domain.User `json:"user"`
}

// LoginWithOAuth authenticates a user by validating their Google ID Token.
func (uc *AuthUsecase) LoginWithOAuth(ctx context.Context, idTokenStr string) (*AuthResponse, error) {
	var email string

	// DEV BYPASS: Only in non-release mode. If no valid Client ID is configured,
	// treat idTokenStr as a raw email for local testing purposes.
	// BUG-04 FIX: This bypass is now DISABLED when GIN_MODE=release to prevent
	// unauthorized access in production deployments.
	ginMode := os.Getenv("GIN_MODE")
	isDevBypass := ginMode != "release" && (uc.googleClientID == "" || uc.googleClientID == "isi_dengan_client_id_google_anda_disini.apps.googleusercontent.com")

	if isDevBypass {
		log.Println("⚠️ OAUTH DEV BYPASS ACTIVATED: Using raw string as email (non-release mode)")
		email = idTokenStr
	} else {
		// Verify Google ID Token (Sistem Real)
		payload, err := idtoken.Validate(ctx, idTokenStr, uc.googleClientID)
		if err != nil {
			return nil, errors.New("token google tidak valid atau sudah kedaluwarsa")
		}

		emailRaw, ok := payload.Claims["email"]
		if !ok {
			return nil, errors.New("tidak ada email di dalam token google")
		}
		email = emailRaw.(string)
	}

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
		Details:      "Login via Google",
	})

	return &AuthResponse{Token: tokenStr, ExpiresAt: expiresAt, User: user}, nil
}
