package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/smallthingscoffee/pos-backend/internal/middleware"
	"github.com/smallthingscoffee/pos-backend/internal/repository"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

type CashierHandler struct {
	cashierUC *usecase.CashierUsecase
	shiftUC   *usecase.ShiftUsecase
	txnUC     *usecase.TransactionUsecase
}

func NewCashierHandler(cu *usecase.CashierUsecase, su *usecase.ShiftUsecase, tu *usecase.TransactionUsecase) *CashierHandler {
	return &CashierHandler{cashierUC: cu, shiftUC: su, txnUC: tu}
}

// GET /cashier/menu
func (h *CashierHandler) GetMenu(c *gin.Context) {
	menu, err := h.cashierUC.GetMenu(c.Request.Context())
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, menu)
}

// POST /cashier/shifts/open
func (h *CashierHandler) OpenShift(c *gin.Context) {
	var req struct {
		OutletID     uuid.UUID `json:"outlet_id" binding:"required"`
		StartingCash float64   `json:"starting_cash" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}

	claims := middleware.GetUserClaims(c)
	shift, err := h.shiftUC.OpenShift(c.Request.Context(), claims.UserID, req.OutletID, req.StartingCash)
	if err != nil {
		RespondError(c, http.StatusUnprocessableEntity, "UNPROCESSABLE", err.Error())
		return
	}
	RespondSuccess(c, http.StatusCreated, shift)
}

// GET /cashier/shifts/current
func (h *CashierHandler) GetCurrentShift(c *gin.Context) {
	claims := middleware.GetUserClaims(c)
	shift, err := h.shiftUC.GetCurrentShift(c.Request.Context(), claims.UserID)
	if err != nil {
		RespondSuccess(c, http.StatusOK, nil)
		return
	}
	RespondSuccess(c, http.StatusOK, shift)
}

// GET /cashier/shifts/current/summary
func (h *CashierHandler) GetCurrentShiftSummary(c *gin.Context) {
	claims := middleware.GetUserClaims(c)

	shift, err := h.shiftUC.GetCurrentShift(c.Request.Context(), claims.UserID)
	if err != nil {
		RespondError(c, http.StatusNotFound, "NOT_FOUND", "Anda tidak memiliki shift aktif")
		return
	}

	summary, err := h.shiftUC.GetShiftSummary(c.Request.Context(), shift.ID)
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Gagal memproses rekap shift")
		return
	}

	RespondSuccess(c, http.StatusOK, summary)
}

// POST /cashier/shifts/close
func (h *CashierHandler) CloseShift(c *gin.Context) {
	var req struct {
		ShiftID         uuid.UUID `json:"shift_id" binding:"required"`
		EndingCash      float64   `json:"ending_cash"`
		DiscrepancyNote string    `json:"discrepancy_note"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}

	shift, err := h.shiftUC.CloseShift(c.Request.Context(), req.ShiftID, req.EndingCash, req.DiscrepancyNote)
	if err != nil {
		RespondError(c, http.StatusUnprocessableEntity, "UNPROCESSABLE", err.Error())
		return
	}

	summary, _ := h.shiftUC.GetShiftSummary(c.Request.Context(), shift.ID)

	response := gin.H{
		"id":                 shift.ID,
		"outlet_id":          shift.OutletID,
		"started_at":         shift.StartedAt,
		"closed_at":          shift.ClosedAt,
		"starting_cash":      shift.StartingCash,
		"ending_cash":        shift.EndingCash,
		"expected_cash":      shift.ExpectedCash,
		"discrepancy":        shift.Discrepancy,
		"discrepancy_note":   shift.DiscrepancyNote,
		"status":             shift.Status,
		"total_sales":        0.0,
		"total_transactions": 0,
		"cash_sales":         0.0,
		"qris_sales":         0.0,
		"card_sales":         0.0,
	}

	if summary != nil {
		response["total_sales"] = summary.TotalSales
		response["total_transactions"] = summary.TotalTransactions
		response["cash_sales"] = summary.CashSales
		response["qris_sales"] = summary.QRISSales
		response["card_sales"] = summary.CardSales
	}

	RespondSuccess(c, http.StatusOK, response)
}

// POST /cashier/transactions
func (h *CashierHandler) CreateTransaction(c *gin.Context) {
	var req domain.CreateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}

	claims := middleware.GetUserClaims(c)
	txn, err := h.txnUC.CreateTransaction(c.Request.Context(), req, claims.UserID)
	if err != nil {
		RespondError(c, http.StatusUnprocessableEntity, "UNPROCESSABLE", err.Error())
		return
	}
	RespondSuccess(c, http.StatusCreated, txn)
}

// GET /cashier/transactions/:id
func (h *CashierHandler) GetTransaction(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid transaction ID")
		return
	}
	txn, err := h.txnUC.GetTransaction(c.Request.Context(), id)
	if err != nil {
		RespondError(c, http.StatusNotFound, "NOT_FOUND", "Transaction not found")
		return
	}
	RespondSuccess(c, http.StatusOK, txn)
}

// POST /cashier/transactions/:id/void
func (h *CashierHandler) VoidTransaction(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid transaction ID")
		return
	}
	if err := h.txnUC.VoidTransaction(c.Request.Context(), id); err != nil {
		RespondError(c, http.StatusUnprocessableEntity, "UNPROCESSABLE", err.Error())
		return
	}
	RespondSuccess(c, http.StatusOK, gin.H{"status": "void"})
}

// GET /cashier/transactions
func (h *CashierHandler) ListTransactions(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))

	filter := repository.TransactionFilter{Page: page, PerPage: perPage}

	if shiftID := c.Query("shift_id"); shiftID != "" {
		id, _ := uuid.Parse(shiftID)
		filter.ShiftID = &id
	}
	if pm := c.Query("payment_method"); pm != "" {
		method := domain.PaymentMethod(pm)
		filter.PaymentMethod = &method
	}

	txns, total, err := h.txnUC.ListTransactions(c.Request.Context(), filter)
	if err != nil {
		RespondError(c, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	RespondPaginated(c, txns, page, perPage, total)
}

func (h *CashierHandler) RegisterRoutes(rg *gin.RouterGroup) {
	cashier := rg.Group("/cashier")
	cashier.GET("/menu", h.GetMenu)
	cashier.POST("/shifts/open", h.OpenShift)
	cashier.GET("/shifts/current", h.GetCurrentShift)
	cashier.GET("/shifts/current/summary", h.GetCurrentShiftSummary)
	cashier.POST("/shifts/close", h.CloseShift)
	cashier.POST("/transactions", h.CreateTransaction)
	cashier.POST("/transactions/:id/void", h.VoidTransaction)
	cashier.GET("/transactions", h.ListTransactions)
	cashier.GET("/transactions/:id", h.GetTransaction)
}
