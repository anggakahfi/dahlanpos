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
	"github.com/joho/godotenv"
	"github.com/smallthingscoffee/pos-backend/internal/config"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/handler"
	cloudinary_infra "github.com/smallthingscoffee/pos-backend/internal/infrastructure/cloudinary"
	"github.com/smallthingscoffee/pos-backend/internal/infrastructure/postgres"
	"github.com/smallthingscoffee/pos-backend/internal/middleware"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

func main() {
	_ = godotenv.Load() // Load .env file if it exists, otherwise ignore and use system env map
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
	dashboardRepo := postgres.NewDashboardRepo(pool)

	// ─── Usecases ───────────────────────────────────────────
	authUC := usecase.NewAuthUsecase(userRepo, activityLogRepo, cfg.JWTSecret, cfg.GoogleClientID)
	cashierUC := usecase.NewCashierUsecase(productRepo, categoryRepo, modifierRepo)
	shiftUC := usecase.NewShiftUsecase(shiftRepo, txnRepo, activityLogRepo, outletRepo)
	txnUC := usecase.NewTransactionUsecase(txnRepo, activityLogRepo, productRepo, shiftRepo, outletRepo)
	productUC := usecase.NewProductUsecase(productRepo)
	categoryUC := usecase.NewCategoryUsecase(categoryRepo)
	modifierUC := usecase.NewModifierUsecase(modifierRepo)
	employeeUC := usecase.NewEmployeeUsecase(userRepo, activityLogRepo, cfg.ResendAPIKey)
	outletUC := usecase.NewOutletUsecase(outletRepo)
	settingsUC := usecase.NewSettingsUsecase(settingsRepo)
	dashboardUC := usecase.NewDashboardUsecase(dashboardRepo)

	// ─── Infrastructure ──────────────────────────────────────────
	cloudinarySvc, err := cloudinary_infra.NewCloudinaryService(cfg.CloudinaryURL)
	if err != nil {
		log.Printf("⚠️ Failed to initialize Cloudinary: %v", err)
	} else {
		log.Println("✅ Cloudinary initialized")
	}

	// ─── Handlers ───────────────────────────────────────────
	authHandler := handler.NewAuthHandler(authUC, activityLogRepo)
	cashierHandler := handler.NewCashierHandler(cashierUC, shiftUC, txnUC)
	backofficeHandler := handler.NewBackofficeHandler(
		productUC, categoryUC, modifierUC, employeeUC, outletUC, settingsUC, txnUC, shiftUC, dashboardUC, cloudinarySvc,
	)
	publicHandler := handler.NewPublicHandler(txnUC, settingsUC, outletUC)

	// ─── Router ─────────────────────────────────────────────
	router := gin.Default()
	router.Use(middleware.CORSMiddleware(cfg.CORSOrigin))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "timestamp": time.Now().UTC()})
	})

	// API v1
	v1 := router.Group("/api/v1")

	// Public routes (no auth) — login only
	authHandler.RegisterPublicRoutes(v1)
	
	publicGroup := v1.Group("/public")
	publicHandler.RegisterRoutes(publicGroup)

	// Protected routes (require JWT)
	protected := v1.Group("")
	protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))

	// Protected auth routes (logout needs JWT claims)
	authHandler.RegisterProtectedRoutes(protected)

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
		log.Printf(" Server starting on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	// Background job to Auto-Close expired shifts
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()
		for range ticker.C {
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			affected, err := shiftRepo.AutoCloseExpiredShifts(ctx)
			if err != nil {
				log.Printf("⚠️ AutoCloseExpiredShifts failed: %v", err)
			} else if affected > 0 {
				log.Printf("🧹 Auto-closed %d expired shifts", affected)
			}
			cancel()
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
