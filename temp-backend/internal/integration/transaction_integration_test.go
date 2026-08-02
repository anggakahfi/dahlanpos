//go:build integration

package integration_test

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// TestIntegration_Checkout_DeductsStock verifies that a successful transaction
// accurately deducts the sold quantity from the available stock of specific products.
func TestIntegration_Checkout_DeductsStock(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Test Outlet")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	productID := InsertProduct(t, "Kopi Susu", 15000, 10, nil)
	shiftID := InsertShift(t, userID, outletID, 100000)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	payload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s",
        "payment_method": "cash",
        "subtotal": 30000, "tax_amount": 0,
        "discount_amount": 0, "total_amount": 30000,
        "items": [{"product_id": "%s", "product_name": "Kopi Susu",
                   "quantity": 2, "unit_price": 15000, "modifiers": []}]
    }`, shiftID, outletID, productID)

	w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", payload, token)

	assert.Equal(t, http.StatusCreated, w.Code)

	var resp map[string]interface{}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
	assert.True(t, resp["success"].(bool))

	var stockAfter float64 // stock in db is int but testing against json mapping might differ, we map natively
	err := testDB.QueryRow(context.Background(),
		`SELECT stock FROM products WHERE id = $1`, productID,
	).Scan(&stockAfter)
	require.NoError(t, err)
	assert.Equal(t, float64(8), stockAfter, "Stok harus berkurang dari 10 menjadi 8")
}

// TestIntegration_Checkout_Fails_InsufficientStock ensures the system rejects any
// transaction request where the demanded quantity surpasses the available stock on hand.
func TestIntegration_Checkout_Fails_InsufficientStock(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Test Outlet")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	productID := InsertProduct(t, "Stok Sedikit", 10000, 1, nil) // stock = 1
	shiftID := InsertShift(t, userID, outletID, 50000)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	payload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s",
        "payment_method": "cash",
        "subtotal": 30000, "tax_amount": 0,
        "discount_amount": 0, "total_amount": 30000,
        "items": [{"product_id": "%s", "product_name": "Stok Sedikit",
                   "quantity": 3, "unit_price": 10000, "modifiers": []}]
    }`, shiftID, outletID, productID)

	w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", payload, token)

	// Will either return 422 UnprocessableEntity or 400 or 500 depends on handler, but shouldn't be 201
	assert.NotEqual(t, http.StatusCreated, w.Code)

	var stockAfter float64
	err := testDB.QueryRow(context.Background(),
		`SELECT stock FROM products WHERE id = $1`, productID,
	).Scan(&stockAfter)
	require.NoError(t, err)
	assert.Equal(t, float64(1), stockAfter, "Stok tidak boleh berubah jika checkout gagal")
}

// TestIntegration_VoidTransaction_RestoresStock guarantees that when a valid API
// void request is successfully processed, the associated product instances have their stock numbers properly credited back.
func TestIntegration_VoidTransaction_RestoresStock(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Test Outlet")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	productID := InsertProduct(t, "Produk Void", 20000, 10, nil)
	shiftID := InsertShift(t, userID, outletID, 100000)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	checkoutPayload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s",
        "payment_method": "cash", "subtotal": 20000,
        "tax_amount": 0, "discount_amount": 0, "total_amount": 20000,
        "items": [{"product_id": "%s", "product_name": "Produk Void",
                   "quantity": 1, "unit_price": 20000, "modifiers": []}]
    }`, shiftID, outletID, productID)

	w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", checkoutPayload, token)
	require.Equal(t, http.StatusCreated, w.Code)

	var createResp struct {
		Data struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &createResp))
	txnID := createResp.Data.ID

	// Void transaksi
	wVoid := DoRequest(t, router, "POST",
		"/api/v1/cashier/transactions/"+txnID+"/void", "", token)
	assert.Equal(t, http.StatusOK, wVoid.Code)

	// Stok harus kembali ke 10
	var stockAfter float64
	err := testDB.QueryRow(context.Background(),
		`SELECT stock FROM products WHERE id = $1`, productID,
	).Scan(&stockAfter)
	require.NoError(t, err)
	assert.Equal(t, float64(10), stockAfter, "Stok harus kembali ke 10 setelah void")
}

// TestIntegration_Checkout_Fails_OnClosedShift validates that the POS block rejects
// new checkout transactions directly bound to a shift ID that is already finalized and closed.
func TestIntegration_Checkout_Fails_OnClosedShift(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Test Outlet")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	productID := InsertProduct(t, "Produk Closed Shift", 10000, 10, nil)
	shiftID := InsertShift(t, userID, outletID, 100000)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	// Tutup shift langsung di DB untuk simulasi shift mati
	_, err := testDB.Exec(context.Background(),
		`UPDATE shifts SET status = 'closed', closed_at = NOW() WHERE id = $1`, shiftID)
	require.NoError(t, err)

	payload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s", "payment_method": "cash",
        "subtotal": 10000, "tax_amount": 0, "discount_amount": 0, "total_amount": 10000,
        "items": [{"product_id": "%s", "product_name": "Produk Closed Shift",
                   "quantity": 1, "unit_price": 10000, "modifiers": []}]
    }`, shiftID, outletID, productID)

	w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", payload, token)
	assert.Equal(t, http.StatusUnprocessableEntity, w.Code,
		"Checkout ke shift closed harus ditolak dengan 422")

	// Stok tidak boleh berkurang
	var stockAfter float64
	testDB.QueryRow(context.Background(),
		`SELECT stock FROM products WHERE id = $1`, productID,
	).Scan(&stockAfter)
	assert.Equal(t, float64(10), stockAfter, "Stok tidak boleh berubah jika shift sudah closed")
}

// TestIntegration_VoidTransaction_PreventDoubleVoid specifically guards against
// race conditions or UI retries that attempt to void an already-voided transaction,
// preventing duplicate stock increments and inaccurate financial logs.
func TestIntegration_VoidTransaction_PreventDoubleVoid(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Test Outlet")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	productID := InsertProduct(t, "Produk Double Void", 15000, 10, nil)
	shiftID := InsertShift(t, userID, outletID, 100000)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	// Checkout
	checkoutPayload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s", "payment_method": "cash",
        "subtotal": 15000, "tax_amount": 0, "discount_amount": 0, "total_amount": 15000,
        "items": [{"product_id": "%s", "product_name": "Produk Double Void",
                   "quantity": 1, "unit_price": 15000, "modifiers": []}]
    }`, shiftID, outletID, productID)
	w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", checkoutPayload, token)
	require.Equal(t, http.StatusCreated, w.Code)

	var createResp struct {
		Data struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &createResp))
	txnID := createResp.Data.ID

	// Void pertama — harus sukses
	wVoid1 := DoRequest(t, router, "POST", "/api/v1/cashier/transactions/"+txnID+"/void", "", token)
	require.Equal(t, http.StatusOK, wVoid1.Code, "Void pertama harus berhasil")

	// Void kedua — harus ditolak
	wVoid2 := DoRequest(t, router, "POST", "/api/v1/cashier/transactions/"+txnID+"/void", "", token)
	assert.NotEqual(t, http.StatusOK, wVoid2.Code, "Double void harus ditolak")

	// Stok harus tetap 10 (bukan 11)
	var stockAfter float64
	testDB.QueryRow(context.Background(),
		`SELECT stock FROM products WHERE id = $1`, productID,
	).Scan(&stockAfter)
	assert.Equal(t, float64(10), stockAfter, "Stok tidak boleh naik 2x akibat double void")
}

// TestIntegration_VoidTransaction_BlocksCrossUserVoid ensures strict multi-tenant
// permission constraints where a cashier is strictly forbidden from voiding a
// transaction established by another cashier, mitigating malicious data alterations.
func TestIntegration_VoidTransaction_BlocksCrossUserVoid(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Test Outlet")
	user1ID := InsertUser(t, "kasir1@test.com", domain.RoleCashier, &outletID)
	user2ID := InsertUser(t, "kasir2@test.com", domain.RoleCashier, &outletID)
	productID := InsertProduct(t, "Produk Kasir1", 10000, 10, nil)
	shiftID := InsertShift(t, user1ID, outletID, 100000)
	token1 := MakeAuthToken(t, user1ID, "kasir1@test.com", domain.RoleCashier, &outletID)
	token2 := MakeAuthToken(t, user2ID, "kasir2@test.com", domain.RoleCashier, &outletID)

	// Kasir1 melakukan checkout
	checkoutPayload := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s", "payment_method": "cash",
        "subtotal": 10000, "tax_amount": 0, "discount_amount": 0, "total_amount": 10000,
        "items": [{"product_id": "%s", "product_name": "Produk Kasir1",
                   "quantity": 1, "unit_price": 10000, "modifiers": []}]
    }`, shiftID, outletID, productID)
	w := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", checkoutPayload, token1)
	require.Equal(t, http.StatusCreated, w.Code)

	var createResp struct {
		Data struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &createResp))
	txnID := createResp.Data.ID

	// Kasir2 mencoba void transaksi milik kasir1 — harus ditolak
	wVoid := DoRequest(t, router, "POST", "/api/v1/cashier/transactions/"+txnID+"/void", "", token2)
	assert.NotEqual(t, http.StatusOK, wVoid.Code, "Kasir lain tidak boleh void transaksi bukan miliknya")

	// Status transaksi harus tetap 'paid'
	var paymentStatus string
	testDB.QueryRow(context.Background(),
		`SELECT payment_status FROM transactions WHERE id = $1`, txnID,
	).Scan(&paymentStatus)
	assert.Equal(t, "paid", paymentStatus, "Status transaksi tidak boleh berubah")
}
