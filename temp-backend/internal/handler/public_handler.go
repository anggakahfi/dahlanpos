package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/usecase"
)

type PublicHandler struct {
	txnUC      *usecase.TransactionUsecase
	settingsUC *usecase.SettingsUsecase
	outletUC   *usecase.OutletUsecase
}

func NewPublicHandler(txnUC *usecase.TransactionUsecase, settingsUC *usecase.SettingsUsecase, outletUC *usecase.OutletUsecase) *PublicHandler {
	return &PublicHandler{
		txnUC:      txnUC,
		settingsUC: settingsUC,
		outletUC:   outletUC,
	}
}

func (h *PublicHandler) RegisterRoutes(router *gin.RouterGroup) {
	receipts := router.Group("/receipts")
	{
		receipts.GET("/:id", h.GetReceipt)
	}
}

// GetReceipt fetches a transaction by ID and the global receipt settings for public rendering
func (h *PublicHandler) GetReceipt(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid receipt ID"})
		return
	}

	// 1. Fetch Transaction
	txn, err := h.txnUC.GetTransaction(c.Request.Context(), id)
	if err != nil {
		log.Printf("[PublicHandler] GetReceipt error: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Receipt not found"})
		return
	}

	// 2. Fetch Global Settings (Specifically Receipt Settings)
	settings, err := h.settingsUC.Get(c.Request.Context())
	if err != nil {
		log.Printf("[PublicHandler] Warning: failed to fetch settings for receipt: %v", err)
		// We still return the transaction even if settings fail
	}

	// 3. Construct Combined Payload
	// We intentionally do not expose cost of goods or internal identifiers if we don't have to,
	// but since txn is returned by GetTransactionByID, we just map it out cleanly or return it as is.
	// For MVP, we return both in a wrapper.
	
	// 3. Fetch Outlet info for the transaction
	var outletInfo interface{}
	if outlet, err := h.outletUC.GetByID(c.Request.Context(), txn.OutletID); err == nil {
		outletInfo = outlet
	}

	type Response struct {
		Success     bool        `json:"success"`
		Transaction interface{} `json:"transaction"`
		Settings    interface{} `json:"settings"`
		Outlet      interface{} `json:"outlet"`
	}

	var receiptSettings interface{}
	if settings != nil {
		receiptSettings = settings.Receipt
	}

	c.JSON(http.StatusOK, Response{
		Success:     true,
		Transaction: txn,
		Settings:    receiptSettings,
		Outlet:      outletInfo,
	})
}
