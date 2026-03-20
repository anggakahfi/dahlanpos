package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/smallthingscoffee/pos-backend/internal/config"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/handler"
	"github.com/smallthingscoffee/pos-backend/internal/infrastructure/postgres"
	"github.com/smallthingscoffee/pos-backend/internal/middleware"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

func main() {
	cfg := config.Load()

	// ─── Database ───────────────────────────────────────────
	pool, err := postgres.NewConnection(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}
	defer pool.Close()
	log.Println("✅ Database connected")

	// ─── Repositories ───────────────────────────────────────
	userRepo := postgres.NewUserRepo(pool)
	outletRepo := postgres.NewOutletRepo(pool)
	categoryRepo := postgres.NewCategoryRepo(pool)
	productRepo := postgres.NewProductRepo(pool)
	modifierRepo := postgres.NewModifierRepo(pool)
	shiftRepo := postgres.NewShiftRepo(pool)
	txnRepo := postgres.NewTransactionRepo(pool)
	settingsRepo := postgres.NewSettingsRepo(pool)
	activityLogRepo := postgres.NewActivityLogRepo(pool)

	// ─── Usecases ───────────────────────────────────────────
	authUC := usecase.NewAuthUsecase(userRepo, activityLogRepo, cfg.JWTSecret)
	cashierUC := usecase.NewCashierUsecase(productRepo, categoryRepo, modifierRepo)
	shiftUC := usecase.NewShiftUsecase(shiftRepo, txnRepo, activityLogRepo)
	txnUC := usecase.NewTransactionUsecase(txnRepo, activityLogRepo)
	productUC := usecase.NewProductUsecase(productRepo)
	categoryUC := usecase.NewCategoryUsecase(categoryRepo)
	modifierUC := usecase.NewModifierUsecase(modifierRepo)
	employeeUC := usecase.NewEmployeeUsecase(userRepo)
	outletUC := usecase.NewOutletUsecase(outletRepo)
	settingsUC := usecase.NewSettingsUsecase(settingsRepo)

	// ─── Handlers ───────────────────────────────────────────
	authHandler := handler.NewAuthHandler(authUC)
	cashierHandler := handler.NewCashierHandler(cashierUC, shiftUC, txnUC)
	backofficeHandler := handler.NewBackofficeHandler(
		productUC, categoryUC, modifierUC, employeeUC, outletUC, settingsUC, txnUC, shiftUC,
	)

	// ─── Router ─────────────────────────────────────────────
	router := gin.Default()
	router.Use(middleware.CORSMiddleware(cfg.CORSOrigin))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "timestamp": time.Now().UTC()})
	})

	// API v1
	v1 := router.Group("/api/v1")

	// Public routes (no auth)
	authHandler.RegisterRoutes(v1)

	// Protected routes (require JWT)
	protected := v1.Group("")
	protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))

	// Cashier routes (any authenticated user)
	cashierHandler.RegisterRoutes(protected)

	// Backoffice routes (owner only)
	ownerOnly := protected.Group("")
	ownerOnly.Use(middleware.RequireRole(domain.RoleOwner))
	backofficeHandler.RegisterRoutes(ownerOnly)

	// ─── Server ─────────────────────────────────────────────
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("🚀 Server starting on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server exited cleanly")
}
