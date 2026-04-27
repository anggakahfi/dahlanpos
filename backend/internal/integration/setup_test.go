//go:build integration

package integration_test

import (
	"context"
	"os"
	"path/filepath"
	"sort"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/handler"
	"github.com/smallthingscoffee/pos-backend/internal/infrastructure/postgres"
	"github.com/smallthingscoffee/pos-backend/internal/middleware"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

var (
	testDB *pgxpool.Pool
)

const JWTSecret = "integration-test-secret"

// TestMain overrides standard test execution to setup the integration test environment.
// It configures Gin to TestMode, establishes a connection pool to the test database,
// triggers the migration script to ensure a fresh schema, and then executes all tests.
func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)

	dbURL := os.Getenv("TEST_DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://root:password123@127.0.0.1:5433/smallthings_test?sslmode=disable"
	}

	var err error
	testDB, err = pgxpool.New(context.Background(), dbURL)
	if err != nil {
		panic("failed to connect to test database: " + err.Error())
	}
	defer testDB.Close()

	runMigrations()

	os.Exit(m.Run())
}

// runMigrations drops the public schema to clear any left-over data and structure,
// creates a fresh public schema, and executes all .up.sql migration scripts found
// in the project's migration directory sequentially to recreate the database structure.
func runMigrations() {
	ctx := context.Background()
	_, err := testDB.Exec(ctx, `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`)
	if err != nil {
		panic("failed to wipe public schema: " + err.Error())
	}

	// Read and run up.sql migrations sequentially
	files, err := filepath.Glob("../../db/migrations/*.up.sql")
	if err != nil || len(files) == 0 {
		panic("failed to find migration files")
	}
	sort.Strings(files)

	for _, file := range files {
		content, err := os.ReadFile(file)
		if err != nil {
			panic("failed to read migration file: " + file)
		}
		_, err = testDB.Exec(ctx, string(content))
		if err != nil {
			panic("failed to execute migration " + file + ": " + err.Error())
		}
	}
}

// ResetDB forcefully cleans up all tables within the database to provide a clean state
// for each integration test case. It cascades sequence restarts to prevent ID collision.
func ResetDB(t *testing.T) {
	t.Helper()
	_, err := testDB.Exec(context.Background(), `
		TRUNCATE TABLE
			transaction_items, transactions, shifts,
			activity_logs, product_modifier_groups,
			products, modifier_options, modifier_groups,
			categories, users, outlets, settings
		RESTART IDENTITY CASCADE;
	`)
	if err != nil {
		t.Fatalf("failed to reset db: %v", err)
	}

	// Re-insert singleton settings row
	_, err = testDB.Exec(context.Background(), `INSERT INTO settings (id) VALUES (1) ON CONFLICT DO NOTHING`)
	if err != nil {
		t.Fatalf("failed to re-insert settings: %v", err)
	}
}

// BuildRouter initializes and wires all application dependencies (repositories, usecases, handlers)
// to a new test Gin engine instance. It includes route grouping, middleware injection, and RBAC endpoints.
func BuildRouter(t *testing.T) *gin.Engine {
	t.Helper()

	userRepo := postgres.NewUserRepo(testDB)
	outletRepo := postgres.NewOutletRepo(testDB)
	categoryRepo := postgres.NewCategoryRepo(testDB)
	productRepo := postgres.NewProductRepo(testDB)
	modifierRepo := postgres.NewModifierRepo(testDB)
	shiftRepo := postgres.NewShiftRepo(testDB)
	txnRepo := postgres.NewTransactionRepo(testDB)
	settingsRepo := postgres.NewSettingsRepo(testDB)
	activityLogRepo := postgres.NewActivityLogRepo(testDB)
	dashboardRepo := postgres.NewDashboardRepo(testDB)

	authUC := usecase.NewAuthUsecase(userRepo, activityLogRepo, JWTSecret, "") // empty GoogleClientID triggers dev bypass
	cashierUC := usecase.NewCashierUsecase(productRepo, categoryRepo, modifierRepo)
	shiftUC := usecase.NewShiftUsecase(shiftRepo, txnRepo, activityLogRepo, outletRepo)
	txnUC := usecase.NewTransactionUsecase(txnRepo, activityLogRepo, productRepo, shiftRepo, outletRepo)
	productUC := usecase.NewProductUsecase(productRepo)
	categoryUC := usecase.NewCategoryUsecase(categoryRepo)
	modifierUC := usecase.NewModifierUsecase(modifierRepo)
	employeeUC := usecase.NewEmployeeUsecase(userRepo, activityLogRepo, "") // resend API key empty
	outletUC := usecase.NewOutletUsecase(outletRepo)
	settingsUC := usecase.NewSettingsUsecase(settingsRepo)
	dashboardUC := usecase.NewDashboardUsecase(dashboardRepo)

	// Since NewBackofficeHandler signature might be slightly different than documented if they pass nils
	authHandler := handler.NewAuthHandler(authUC, activityLogRepo)
	cashierHandler := handler.NewCashierHandler(cashierUC, shiftUC, txnUC)
	backofficeHandler := handler.NewBackofficeHandler(
		productUC, categoryUC, modifierUC, employeeUC, outletUC, settingsUC, txnUC, shiftUC, dashboardUC, nil,
	)

	router := gin.Default()

	v1 := router.Group("/api/v1")
	authHandler.RegisterPublicRoutes(v1)

	protected := v1.Group("")
	protected.Use(middleware.AuthMiddleware(JWTSecret))

	authHandler.RegisterProtectedRoutes(protected)
	cashierHandler.RegisterRoutes(protected)

	ownerOnly := protected.Group("")
	ownerOnly.Use(middleware.RequireRole(domain.RoleOwner))
	backofficeHandler.RegisterRoutes(ownerOnly)

	return router
}
