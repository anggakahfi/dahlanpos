package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	cloudinary_infra "github.com/smallthingscoffee/pos-backend/internal/infrastructure/cloudinary"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

type BackofficeHandler struct {
	productUC    *usecase.ProductUsecase
	categoryUC   *usecase.CategoryUsecase
	modifierUC   *usecase.ModifierUsecase
	employeeUC   *usecase.EmployeeUsecase
	outletUC     *usecase.OutletUsecase
	settingsUC   *usecase.SettingsUsecase
	txnUC        *usecase.TransactionUsecase
	shiftUC      *usecase.ShiftUsecase
	dashboardUC  *usecase.DashboardUsecase
	uploadSvc    *cloudinary_infra.CloudinaryService
}

func NewBackofficeHandler(
	pu *usecase.ProductUsecase, cu *usecase.CategoryUsecase, mu *usecase.ModifierUsecase,
	eu *usecase.EmployeeUsecase, ou *usecase.OutletUsecase, su *usecase.SettingsUsecase,
	tu *usecase.TransactionUsecase, shu *usecase.ShiftUsecase,
	du *usecase.DashboardUsecase,
	uploadSvc *cloudinary_infra.CloudinaryService,
) *BackofficeHandler {
	return &BackofficeHandler{
		productUC: pu, categoryUC: cu, modifierUC: mu,
		employeeUC: eu, outletUC: ou, settingsUC: su,
		txnUC: tu, shiftUC: shu, dashboardUC: du, uploadSvc: uploadSvc,
	}
}

// ─── Categories ──────────────────────────────────────────────

func (h *BackofficeHandler) ListCategories(c *gin.Context) {
	cats, err := h.categoryUC.List(c.Request.Context())
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, cats)
}

func (h *BackofficeHandler) CreateCategory(c *gin.Context) {
	var cat domain.Category
	if err := c.ShouldBindJSON(&cat); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	if err := h.categoryUC.Create(c.Request.Context(), &cat); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusCreated, cat)
}

func (h *BackofficeHandler) UpdateCategory(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var cat domain.Category
	if err := c.ShouldBindJSON(&cat); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	cat.ID = id
	if err := h.categoryUC.Update(c.Request.Context(), &cat); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, cat)
}

func (h *BackofficeHandler) DeleteCategory(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	if err := h.categoryUC.Delete(c.Request.Context(), id); err != nil {
		if strings.Contains(err.Error(), "23503") || strings.Contains(err.Error(), "foreign key constraint") {
			RespondError(c, http.StatusConflict, "CONFLICT_ERROR", "Kategori tidak bisa dihapus karena masih digunakan oleh produk. Silakan hapus atau ubah produk terkait terlebih dahulu.")
			return
		}
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, gin.H{"deleted": true})
}

// ─── Products ──────────────────────────────────────────────

func (h *BackofficeHandler) ListProducts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))
	filter := repository.ProductFilter{Page: page, PerPage: perPage, Search: c.Query("search")}
	if catID := c.Query("category_id"); catID != "" {
		id, _ := uuid.Parse(catID)
		filter.CategoryID = &id
	}
	products, total, err := h.productUC.List(c.Request.Context(), filter)
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondPaginated(c, products, page, perPage, total)
}

type createProductReq struct {
	domain.Product
	ModifierGroupIDs []uuid.UUID `json:"modifier_group_ids"`
}

func (h *BackofficeHandler) CreateProduct(c *gin.Context) {
	var req createProductReq
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	if err := h.productUC.Create(c.Request.Context(), &req.Product, req.ModifierGroupIDs); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusCreated, req.Product)
}

func (h *BackofficeHandler) UpdateProduct(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var req createProductReq
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	req.Product.ID = id
	if err := h.productUC.Update(c.Request.Context(), &req.Product, req.ModifierGroupIDs); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, req.Product)
}

func (h *BackofficeHandler) PatchProductStock(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var req struct {
		Stock int `json:"stock"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	// BUG-06 FIX: Use SetAbsoluteStock to set exact stock value (not delta)
	if err := h.productUC.SetAbsoluteStock(c.Request.Context(), id, req.Stock); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, gin.H{"updated": true})
}

func (h *BackofficeHandler) DeleteProduct(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	if err := h.productUC.Delete(c.Request.Context(), id); err != nil {
		if strings.Contains(err.Error(), "23503") || strings.Contains(err.Error(), "foreign key constraint") {
			RespondError(c, http.StatusConflict, "CONFLICT_ERROR", "Produk tidak bisa dihapus karena masih memiliki riwayat transaksi. Silakan nonaktifkan status produk ini jika tidak dijual lagi.")
			return
		}
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, gin.H{"deleted": true})
}

// ─── Modifiers ──────────────────────────────────────────────

func (h *BackofficeHandler) ListModifiers(c *gin.Context) {
	groups, err := h.modifierUC.List(c.Request.Context())
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, groups)
}

func (h *BackofficeHandler) CreateModifier(c *gin.Context) {
	var g domain.ModifierGroup
	if err := c.ShouldBindJSON(&g); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	if err := h.modifierUC.Create(c.Request.Context(), &g); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusCreated, g)
}

func (h *BackofficeHandler) UpdateModifier(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var g domain.ModifierGroup
	if err := c.ShouldBindJSON(&g); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	g.ID = id
	if err := h.modifierUC.Update(c.Request.Context(), &g); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, g)
}

func (h *BackofficeHandler) DeleteModifier(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	if err := h.modifierUC.Delete(c.Request.Context(), id); err != nil {
		if strings.Contains(err.Error(), "23503") || strings.Contains(err.Error(), "foreign key constraint") {
			RespondError(c, http.StatusConflict, "CONFLICT_ERROR", "Modifier tidak bisa dihapus karena masih melekat pada salah satu produk. Silakan lepaskan modifier ini dari produk terkait terlebih dahulu.")
			return
		}
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, gin.H{"deleted": true})
}

// ─── Employees ──────────────────────────────────────────────

func (h *BackofficeHandler) ListEmployees(c *gin.Context) {
	emps, err := h.employeeUC.List(c.Request.Context())
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, emps)
}

func (h *BackofficeHandler) CreateEmployee(c *gin.Context) {
	var u domain.User
	if err := c.ShouldBindJSON(&u); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	if err := h.employeeUC.Create(c.Request.Context(), &u); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusCreated, u)
}

func (h *BackofficeHandler) UpdateEmployee(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var u domain.User
	if err := c.ShouldBindJSON(&u); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	u.ID = id
	if err := h.employeeUC.Update(c.Request.Context(), &u); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, u)
}

func (h *BackofficeHandler) PatchEmployeeStatus(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var req struct {
		Status domain.UserStatus `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	if err := h.employeeUC.UpdateStatus(c.Request.Context(), id, req.Status); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, gin.H{"updated": true})
}

func (h *BackofficeHandler) DeleteEmployee(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	if err := h.employeeUC.Delete(c.Request.Context(), id); err != nil {
		if strings.Contains(err.Error(), "23503") || strings.Contains(err.Error(), "foreign key constraint") {
			RespondError(c, http.StatusConflict, "CONFLICT_ERROR", "Karyawan ini tidak bisa dihapus karena telah terhubung dengan riwayat shift atau transaksi. Silakan nonaktifkan (ubah status) karyawan ini.")
			return
		}
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, gin.H{"deleted": true})
}

func (h *BackofficeHandler) ListActivityLogs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))
	filter := repository.ActivityLogFilter{Page: page, PerPage: perPage}

	if uid := c.Query("employee_id"); uid != "" && uid != "all" {
		id, _ := uuid.Parse(uid)
		filter.UserID = &id
	}
	if oid := c.Query("outlet_id"); oid != "" && oid != "all" {
		id, _ := uuid.Parse(oid)
		filter.OutletID = &id
	}
	if at := c.Query("activity_type"); at != "" && at != "all" {
		t := domain.ActivityType(at)
		filter.ActivityType = &t
	}
	loc, _ := time.LoadLocation("Asia/Jakarta")
	if start := c.Query("start_date"); start != "" {
		if t, err := time.Parse(time.RFC3339, start); err == nil {
			tLoc := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, loc)
			filter.StartDate = &tLoc
		}
	}
	if end := c.Query("end_date"); end != "" {
		if t, err := time.Parse(time.RFC3339, end); err == nil {
			tLoc := time.Date(t.Year(), t.Month(), t.Day(), 23, 59, 59, 999999999, loc)
			filter.EndDate = &tLoc
		}
	}

	logs, total, err := h.employeeUC.ListActivityLogs(c.Request.Context(), filter)
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondPaginated(c, logs, page, perPage, total)
}

// ─── Outlets ──────────────────────────────────────────────

func (h *BackofficeHandler) ListOutlets(c *gin.Context) {
	outlets, err := h.outletUC.List(c.Request.Context())
	if err != nil {
		fmt.Println("CRITICAL ERROR IN LIST OUTLETS:", err)
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, outlets)
}

func (h *BackofficeHandler) CreateOutlet(c *gin.Context) {
	var o domain.Outlet
	if err := c.ShouldBindJSON(&o); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	if err := h.outletUC.Create(c.Request.Context(), &o); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusCreated, o)
}

func (h *BackofficeHandler) UpdateOutlet(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var o domain.Outlet
	if err := c.ShouldBindJSON(&o); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	o.ID = id
	if err := h.outletUC.Update(c.Request.Context(), &o); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, o)
}

func (h *BackofficeHandler) PatchOutletStatus(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	var req struct {
		Status domain.OutletStatus `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	if err := h.outletUC.UpdateStatus(c.Request.Context(), id, req.Status); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, gin.H{"updated": true})
}

func (h *BackofficeHandler) DeleteOutlet(c *gin.Context) {
	id, ok := parseUUIDParam(c, "id")
	if !ok {
		return
	}
	if err := h.outletUC.Delete(c.Request.Context(), id); err != nil {
		if strings.Contains(err.Error(), "23503") || strings.Contains(err.Error(), "foreign key constraint") {
			RespondError(c, http.StatusConflict, "CONFLICT_ERROR", "Outlet tidak bisa dihapus karena masih ada data kasir, shift, atau transaksi yang terkait. Silakan nonaktifkan (ubah status) outlet ini.")
			return
		}
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, gin.H{"deleted": true})
}

// ─── Dashboard ──────────────────────────────────────────────

func (h *BackofficeHandler) GetDashboardSummary(c *gin.Context) {
	filter := repository.DashboardFilter{}

	if oid := c.Query("outlet_id"); oid != "" {
		id, _ := uuid.Parse(oid)
		filter.OutletID = &id
	}
	if s := c.Query("start_date"); s != "" {
		if t, err := time.Parse(time.RFC3339, s); err == nil {
			filter.DateFrom = t
		}
	}
	if e := c.Query("end_date"); e != "" {
		if t, err := time.Parse(time.RFC3339, e); err == nil {
			filter.DateTo = t
		}
	}

	// Default to today if no date range provided
	if filter.DateFrom.IsZero() {
		now := time.Now()
		filter.DateFrom = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
		filter.DateTo = time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 999999999, now.Location())
	}

	summary, err := h.dashboardUC.GetSummary(c.Request.Context(), filter)
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, summary)
}

// ─── Reports ──────────────────────────────────────────────

func (h *BackofficeHandler) ListReportTransactions(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))
	filter := repository.TransactionFilter{Page: page, PerPage: perPage}
	if oid := c.Query("outlet_id"); oid != "" {
		id, _ := uuid.Parse(oid)
		filter.OutletID = &id
	}
	if pm := c.Query("payment_method"); pm != "" {
		method := domain.PaymentMethod(pm)
		filter.PaymentMethod = &method
	}
	if search := c.Query("search"); search != "" {
		filter.SearchQuery = &search
	}
	loc, _ := time.LoadLocation("Asia/Jakarta")
	if s := c.Query("start_date"); s != "" {
		if t, err := time.Parse(time.RFC3339, s); err == nil {
			tLoc := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, loc)
			filter.DateFrom = &tLoc
		}
	}
	if e := c.Query("end_date"); e != "" {
		if t, err := time.Parse(time.RFC3339, e); err == nil {
			tLoc := time.Date(t.Year(), t.Month(), t.Day(), 23, 59, 59, 999999999, loc)
			filter.DateTo = &tLoc
		}
	}
	txns, total, totalRev, err := h.txnUC.ListTransactions(c.Request.Context(), filter)
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    txns,
		"meta": gin.H{
			"page":          page,
			"per_page":      perPage,
			"total":         total,
			"total_revenue": totalRev,
		},
	})
}

func (h *BackofficeHandler) ListReportShifts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))

	var outletID *uuid.UUID
	if oid := c.Query("outlet_id"); oid != "" {
		id, _ := uuid.Parse(oid)
		outletID = &id
	}

	var userID *uuid.UUID
	if uid := c.Query("cashier_id"); uid != "" {
		id, _ := uuid.Parse(uid)
		userID = &id
	}

	var startDate, endDate *time.Time
	loc, _ := time.LoadLocation("Asia/Jakarta")
	if s := c.Query("start_date"); s != "" {
		if t, err := time.Parse(time.RFC3339, s); err == nil {
			tLoc := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, loc)
			startDate = &tLoc
		}
	}
	if e := c.Query("end_date"); e != "" {
		if t, err := time.Parse(time.RFC3339, e); err == nil {
			tLoc := time.Date(t.Year(), t.Month(), t.Day(), 23, 59, 59, 999999999, loc)
			endDate = &tLoc
		}
	}

	shifts, total, err := h.shiftUC.ListShifts(c.Request.Context(), outletID, userID, startDate, endDate, page, perPage)
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondPaginated(c, shifts, page, perPage, total)
}

func (h *BackofficeHandler) GetShiftSummaryForReport(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		RespondError(c, http.StatusBadRequest, "INVALID_ID", "Invalid shift ID")
		return
	}
	summary, err := h.shiftUC.GetShiftSummaryByID(c.Request.Context(), id)
	if err != nil {
		RespondError(c, http.StatusNotFound, "NOT_FOUND", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, summary)
}

// ─── Settings ──────────────────────────────────────────────

func (h *BackofficeHandler) GetSettings(c *gin.Context) {
	s, err := h.settingsUC.Get(c.Request.Context())
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, s)
}

func (h *BackofficeHandler) UpdateSettings(c *gin.Context) {
	var s domain.Settings
	if err := c.ShouldBindJSON(&s); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}
	if err := h.settingsUC.Update(c.Request.Context(), &s); err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, s)
}

// ─── Uploads ──────────────────────────────────────────────

func (h *BackofficeHandler) UploadImage(c *gin.Context) {
	fileHeader, err := c.FormFile("image")
	if err != nil {
		RespondError(c, http.StatusBadRequest, "BAD_REQUEST", "image file is required")
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", "failed to open image file")
		return
	}
	defer file.Close()

	if h.uploadSvc == nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Cloudinary service is not configured")
		return
	}

	url, err := h.uploadSvc.UploadImage(c.Request.Context(), file)
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "UPLOAD_FAILED", err.Error())
		return
	}

	RespondSuccess(c, http.StatusOK, gin.H{"url": url})
}

// ─── Route Registration ──────────────────────────────────────────────

func (h *BackofficeHandler) RegisterRoutes(rg *gin.RouterGroup) {
	bo := rg.Group("/backoffice")

	// Categories
	bo.GET("/categories", h.ListCategories)
	bo.POST("/categories", h.CreateCategory)
	bo.PUT("/categories/:id", h.UpdateCategory)
	bo.DELETE("/categories/:id", h.DeleteCategory)

	// Products
	bo.GET("/products", h.ListProducts)
	bo.POST("/products", h.CreateProduct)
	bo.PUT("/products/:id", h.UpdateProduct)
	bo.PATCH("/products/:id/stock", h.PatchProductStock)
	bo.DELETE("/products/:id", h.DeleteProduct)

	// Modifiers
	bo.GET("/modifier-groups", h.ListModifiers)
	bo.POST("/modifier-groups", h.CreateModifier)
	bo.PUT("/modifier-groups/:id", h.UpdateModifier)
	bo.DELETE("/modifier-groups/:id", h.DeleteModifier)

	// Employees
	bo.GET("/employees", h.ListEmployees)
	bo.POST("/employees", h.CreateEmployee)
	bo.PUT("/employees/:id", h.UpdateEmployee)
	bo.PATCH("/employees/:id/status", h.PatchEmployeeStatus)
	bo.DELETE("/employees/:id", h.DeleteEmployee)
	bo.GET("/employees/activity", h.ListActivityLogs)

	// Outlets
	bo.GET("/outlets", h.ListOutlets)
	bo.POST("/outlets", h.CreateOutlet)
	bo.PUT("/outlets/:id", h.UpdateOutlet)
	bo.PATCH("/outlets/:id/status", h.PatchOutletStatus)
	bo.DELETE("/outlets/:id", h.DeleteOutlet)

	// Dashboard
	bo.GET("/dashboard/summary", h.GetDashboardSummary)

	// Reports
	bo.GET("/reports/transactions", h.ListReportTransactions)
	bo.GET("/reports/shifts", h.ListReportShifts)
	bo.GET("/reports/shifts/:id/summary", h.GetShiftSummaryForReport)

	// Settings
	bo.GET("/settings", h.GetSettings)
	bo.PUT("/settings", h.UpdateSettings)

	// Uploads
	bo.POST("/upload", h.UploadImage)
}
