package usecase

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
)

type EmployeeUsecase struct {
	userRepo     repository.UserRepository
	logRepo      repository.ActivityLogRepository
	resendAPIKey string
}

func NewEmployeeUsecase(ur repository.UserRepository, lr repository.ActivityLogRepository, resendKey string) *EmployeeUsecase {
	return &EmployeeUsecase{userRepo: ur, logRepo: lr, resendAPIKey: resendKey}
}

func (uc *EmployeeUsecase) List(ctx context.Context) ([]domain.User, error)                 { return uc.userRepo.FindAll(ctx) }
func (uc *EmployeeUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) { return uc.userRepo.FindByID(ctx, id) }

func (uc *EmployeeUsecase) Create(ctx context.Context, u *domain.User) error {
	if u.Status == "" {
		u.Status = domain.StatusActive
	}
	err := uc.userRepo.Create(ctx, u)
	if err == nil && uc.resendAPIKey != "" {
		// Asynchronously send onboarding email
		go uc.sendWelcomeEmail(u.Email, u.Name)
	}
	return err
}

func (uc *EmployeeUsecase) sendWelcomeEmail(email, name string) {
	url := "https://api.resend.com/emails"
	payload := map[string]interface{}{
		"from":    "DahlanPOS <onboarding@resend.dev>",
		"to":      []string{email},
		"subject": "Selamat Datang di DahlanPOS",
		"html":    fmt.Sprintf("<p>Halo <b>%s</b>,</p><p>Anda baru saja didaftarkan ke sistem POS kami.</p><p>Silakan langsung menuju portal POS dan klik tombol <b>Log In with Google</b> menggunakan email ini.</p><p><br>Salam,<br>Tim DahlanPOS</p>", name),
	}
	jsonData, _ := json.Marshal(payload)
	
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer "+uc.resendAPIKey)
	req.Header.Set("Content-Type", "application/json")
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	
	if err != nil {
		log.Printf("❌ Failed to send welcome email to %s: %v", email, err)
		return
	}
	defer resp.Body.Close()
	
	if resp.StatusCode >= 300 {
		log.Printf("⚠️ Resend API error for %s (Status: %d)", email, resp.StatusCode)
	} else {
		log.Printf("✅ Welcome email successfully queued for %s", email)
	}
}

func (uc *EmployeeUsecase) Update(ctx context.Context, u *domain.User) error              { return uc.userRepo.Update(ctx, u) }
func (uc *EmployeeUsecase) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.UserStatus) error { return uc.userRepo.UpdateStatus(ctx, id, status) }
func (uc *EmployeeUsecase) Delete(ctx context.Context, id uuid.UUID) error                 { return uc.userRepo.Delete(ctx, id) }

func (uc *EmployeeUsecase) ListActivityLogs(ctx context.Context, filter repository.ActivityLogFilter) ([]domain.ActivityLog, int64, error) {
	return uc.logRepo.FindAll(ctx, filter)
}
