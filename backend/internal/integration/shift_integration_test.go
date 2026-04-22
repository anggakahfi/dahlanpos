//go:build integration

package integration_test

import (
	"context"
	"fmt"
	"net/http"
	"testing"

	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/stretchr/testify/assert"
)

// TestIntegration_OpenShift_PreventsDuplicate validates that a cashier cannot open
// a new shift if they already have an active/open shift at the outlet, preventing duplicated states.
func TestIntegration_OpenShift_PreventsDuplicate(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Outlet A")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	payload := fmt.Sprintf(`{"outlet_id": "%s", "starting_cash": 500000}`, outletID)

	// Buka shift pertama — harus sukses
	w1 := DoRequest(t, router, "POST", "/api/v1/cashier/shifts/open", payload, token)
	assert.Equal(t, http.StatusCreated, w1.Code)

	// Coba buka shift kedua — harus ditolak
	w2 := DoRequest(t, router, "POST", "/api/v1/cashier/shifts/open", payload, token)
	assert.Equal(t, http.StatusUnprocessableEntity, w2.Code)

	// Verifikasi hanya 1 shift open di DB
	var count int
	err := testDB.QueryRow(context.Background(),
		`SELECT COUNT(*) FROM shifts WHERE user_id = $1 AND status = 'open'`, userID,
	).Scan(&count)
	if err != nil {
		t.Fatalf("failed to count open shifts: %v", err)
	}
	assert.Equal(t, 1, count)
}

// TestIntegration_CloseShift_CalculatesDiscrepancyCorrectly ensures that upon closing
// a shift, the system correctly calculates expected cash balancing and discrepancy 
// amounts based on the starting cash and total cash sales made during the shift timeframe.
func TestIntegration_CloseShift_CalculatesDiscrepancyCorrectly(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Outlet B")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	productID := InsertProduct(t, "Item Close", 50000, 100, nil)
	shiftID := InsertShift(t, userID, outletID, 200000) // starting_cash 200.000
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	// Buat 1 transaksi cash 50.000
	checkoutPayload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s", "payment_method": "cash",
        "subtotal": 50000, "tax_amount": 0, "discount_amount": 0, "total_amount": 50000,
        "items": [{"product_id": "%s", "product_name": "Item Close",
                   "quantity": 1, "unit_price": 50000, "modifiers": []}]
    }`, shiftID, outletID, productID)
	DoRequest(t, router, "POST", "/api/v1/cashier/transactions", checkoutPayload, token) // assumed to be 201

	// Kasir memasukkan ending_cash 260.000 (padahal expected = 200k + 50k = 250k)
	closePayload := fmt.Sprintf(`{
        "shift_id": "%s", "ending_cash": 260000, "discrepancy_note": ""
    }`, shiftID)
	wClose := DoRequest(t, router, "POST", "/api/v1/cashier/shifts/close", closePayload, token)
	assert.Equal(t, http.StatusOK, wClose.Code)

	// Verifikasi data discrepancy di DB
	var expectedCash, discrepancy float64
	err := testDB.QueryRow(context.Background(),
		`SELECT expected_cash, discrepancy FROM shifts WHERE id = $1`, shiftID,
	).Scan(&expectedCash, &discrepancy)
	if err != nil {
		t.Fatalf("failed to get discrepancy: %v", err)
	}

	assert.Equal(t, 250000.0, expectedCash, "Expected cash = starting + cash sales")
	assert.Equal(t, 10000.0, discrepancy, "Discrepancy = ending - expected")
}

// TestIntegration_CloseShift_BlocksCrossUserAccess validates multi-tenant cashier separation,
// ensuring one cashier cannot maliciously or accidentally close another cashier's active shift.
func TestIntegration_CloseShift_BlocksCrossUserAccess(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Outlet C")
	user1ID := InsertUser(t, "kasir1@test.com", domain.RoleCashier, &outletID)
	user2ID := InsertUser(t, "kasir2@test.com", domain.RoleCashier, &outletID)
	shiftID := InsertShift(t, user1ID, outletID, 100000)

	// Token milik kasir2 mencoba tutup shift kasir1
	tokenUser2 := MakeAuthToken(t, user2ID, "kasir2@test.com", domain.RoleCashier, &outletID)
	closePayload := fmt.Sprintf(`{"shift_id": "%s", "ending_cash": 100000}`, shiftID)

	w := DoRequest(t, router, "POST", "/api/v1/cashier/shifts/close", closePayload, tokenUser2)
	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)

	// Shift harus tetap 'open'
	var status string
	err := testDB.QueryRow(context.Background(),
		`SELECT status FROM shifts WHERE id = $1`, shiftID,
	).Scan(&status)
	if err != nil {
		t.Fatalf("failed to get status: %v", err)
	}
	assert.Equal(t, "open", status)
}
