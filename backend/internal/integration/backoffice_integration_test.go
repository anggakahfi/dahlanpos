//go:build integration

package integration_test

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/smallthingscoffee/pos-backend/internal/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// ========= 6.4 Tier 2 — Produk & Kategori =========

// TestIntegration_CreateProduct_WithCategory_Succeeds validates the successful creation 
// of a product entity specifically ensuring it correctly maps to the requested category ID.
func TestIntegration_CreateProduct_WithCategory_Succeeds(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	catID := InsertCategory(t, "Minuman")

	payload := fmt.Sprintf(`{
        "name": "Kopi Susu",
        "price": 20000,
        "stock": 50,
        "unit": "pcs",
        "category_id": "%s"
    }`, catID.String())

	w := DoRequest(t, router, "POST", "/api/v1/backoffice/products", payload, token)
	assert.Equal(t, http.StatusCreated, w.Code)

	var resp struct {
		Data struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))

	var dbCatID uuid.UUID
	err := testDB.QueryRow(context.Background(), "SELECT category_id FROM products WHERE id = $1", resp.Data.ID).Scan(&dbCatID)
	require.NoError(t, err)
	assert.Equal(t, catID, dbCatID)
}

// TestIntegration_CreateProduct_WithModifiers_LinksGroups ensures that during 
// product insertion, the specified modifier groups are properly linked via the join table.
func TestIntegration_CreateProduct_WithModifiers_LinksGroups(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	catID := InsertCategory(t, "Minuman")
	modID := InsertModifierGroup(t, "Ukuran", true)
	InsertModifierOption(t, modID, "Regular", 0)

	payload := fmt.Sprintf(`{
        "name": "Teh Manis",
        "price": 10000,
        "stock": 100,
        "unit": "pcs",
        "category_id": "%s",
        "modifier_group_ids": ["%s"]
    }`, catID.String(), modID.String())

	w := DoRequest(t, router, "POST", "/api/v1/backoffice/products", payload, token)
	assert.Equal(t, http.StatusCreated, w.Code)

	var resp struct {
		Data struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))

	var count int
	err := testDB.QueryRow(context.Background(), 
        "SELECT COUNT(*) FROM product_modifier_groups WHERE product_id = $1 AND modifier_group_id = $2", 
        resp.Data.ID, modID).Scan(&count)
	require.NoError(t, err)
	assert.Equal(t, 1, count)
}

// TestIntegration_CreateProduct_InvalidCategory_Fails ensures that supplying 
// a non-existent category UUID during a product creation attempt gets properly rejected.
func TestIntegration_CreateProduct_InvalidCategory_Fails(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	fakeCatID := uuid.New().String()

	payload := fmt.Sprintf(`{
        "name": "Kopi Gagal",
        "price": 15000,
        "stock": 10,
        "category_id": "%s"
    }`, fakeCatID)

	w := DoRequest(t, router, "POST", "/api/v1/backoffice/products", payload, token)
	assert.NotEqual(t, http.StatusCreated, w.Code)

	var count int
	testDB.QueryRow(context.Background(), "SELECT COUNT(*) FROM products WHERE name = 'Kopi Gagal'").Scan(&count)
	assert.Equal(t, 0, count)
}

// TestIntegration_UpdateProduct_StockPatch_SetsAbsolute validates the PATCH endpoint
// for adjusting stock directly overrides the current quantity with the absolute dispatched amount.
func TestIntegration_UpdateProduct_StockPatch_SetsAbsolute(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	prodID := InsertProduct(t, "Test Stok", 10000, 10, nil)

	payload := `{"stock": 3}`
	w := DoRequest(t, router, "PATCH", "/api/v1/backoffice/products/"+prodID.String()+"/stock", payload, token)
	assert.Equal(t, http.StatusOK, w.Code)

	var stock int
	testDB.QueryRow(context.Background(), "SELECT stock FROM products WHERE id = $1", prodID).Scan(&stock)
	assert.Equal(t, 3, stock)
}

// TestIntegration_DeleteCategory_WithProducts_SetsProductsToNull ensures foreign
// key constraint triggers effectively execute an ON DELETE SET NULL on dependent products 
// rather than preventing category removal or cascade-deleting the products themselves.
func TestIntegration_DeleteCategory_WithProducts_SetsProductsToNull(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	catID := InsertCategory(t, "Akan Dihapus")
	prodID := InsertProduct(t, "Produk", 10000, 10, &catID)

	w := DoRequest(t, router, "DELETE", "/api/v1/backoffice/categories/"+catID.String(), "", token)
	assert.Equal(t, http.StatusOK, w.Code) // Seharusnya sukses karena migrate pake ON DELETE SET NULL

	var count int
	testDB.QueryRow(context.Background(), "SELECT COUNT(*) FROM categories WHERE id = $1", catID).Scan(&count)
	assert.Equal(t, 0, count, "Kategori harus terhapus")
	
	// Validasi category_id di product jadi NULL
	var savedCatID *uuid.UUID
	testDB.QueryRow(context.Background(), "SELECT category_id FROM products WHERE id = $1", prodID).Scan(&savedCatID)
	assert.Nil(t, savedCatID, "Category ID di produk harus jadi NULL")
}

// TestIntegration_DeleteCategory_EmptyCategory_Succeeds validates the general 
// deletion operational flow for a category devoid of any associated products.
func TestIntegration_DeleteCategory_EmptyCategory_Succeeds(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	catID := InsertCategory(t, "Kosong")

	w := DoRequest(t, router, "DELETE", "/api/v1/backoffice/categories/"+catID.String(), "", token)
	assert.Equal(t, http.StatusOK, w.Code)

	var count int
	testDB.QueryRow(context.Background(), "SELECT COUNT(*) FROM categories WHERE id = $1", catID).Scan(&count)
	assert.Equal(t, 0, count)
}

// TestIntegration_DeleteModifier_LinkedToProduct_Cascades checks whether deleting 
// a modifier natively evaluates the ON DELETE CASCADE condition on joining tables 
// properly unbinding it from any attached products automatically.
func TestIntegration_DeleteModifier_LinkedToProduct_Cascades(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	token := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	modID := InsertModifierGroup(t, "Gula", false)
	InsertModifierOption(t, modID, "Normal", 0)
	prodID := InsertProduct(t, "Kopi", 10000, 10, nil)
	LinkProductModifier(t, prodID, modID)

	w := DoRequest(t, router, "DELETE", "/api/v1/backoffice/modifier-groups/"+modID.String(), "", token)
	assert.Equal(t, http.StatusOK, w.Code) // Karena ON DELETE CASCADE
	
	var count int
	testDB.QueryRow(context.Background(), "SELECT COUNT(*) FROM product_modifier_groups WHERE modifier_group_id = $1", modID).Scan(&count)
	assert.Equal(t, 0, count, "Relasi linking product_modifier harus ikut terhapus via CASCADE")
}

// ========= 6.5 Tier 2 — Menu & Agregasi =========

// TestIntegration_GetMenu_OnlyActiveProducts ensures the POS menu extraction
// actively filters out items that represent soft-deleted or inactive lifecycle states.
func TestIntegration_GetMenu_OnlyActiveProducts(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Kasir Outlet")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	InsertProduct(t, "Aktif", 10000, 10, nil)
	
	inactID := InsertProduct(t, "Tidak Aktif", 10000, 10, nil)
	_, err := testDB.Exec(context.Background(), "UPDATE products SET is_active = false WHERE id = $1", inactID)
	require.NoError(t, err)

	w := DoRequest(t, router, "GET", "/api/v1/cashier/menu", "", token)
	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data struct {
			Items []map[string]interface{} `json:"items"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
	
	// Menu returns list of categories which contains items
	var foundActive bool
	for _, itemIfc := range resp.Data.Items {
		assert.NotEqual(t, "Tidak Aktif", itemIfc["name"])
		if itemIfc["name"] == "Aktif" {
			foundActive = true
		}
	}
	assert.True(t, foundActive)
}

// TestIntegration_GetMenu_LoadsModifierOptions ensures that when the caching
// or direct database queries pull the menu, it accurately embeds related modifier groups
// within the root response to facilitate cashier interface rendering.
func TestIntegration_GetMenu_LoadsModifierOptions(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outletID := InsertOutlet(t, "Kasir Outlet")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	modID := InsertModifierGroup(t, "Suhu", true)
	InsertModifierOption(t, modID, "Panas", 0)
	
	prodID := InsertProduct(t, "Teh", 10000, 10, nil)
	LinkProductModifier(t, prodID, modID)

	w := DoRequest(t, router, "GET", "/api/v1/cashier/menu", "", token)
	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data struct {
			Items []map[string]interface{} `json:"items"`
			ModifierGroups []map[string]interface{} `json:"modifier_groups"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))

	var foundProduct bool
	for _, itemIfc := range resp.Data.Items {
		if itemIfc["name"] == "Teh" {
			foundProduct = true
			mods := itemIfc["modifier_group_ids"].([]interface{})
			assert.Greater(t, len(mods), 0, "Product harus memiliki modifier group IDs")
		}
	}
	assert.True(t, foundProduct, "Produk Teh harus ada dalam response items")

	var foundMod bool
	for _, mod := range resp.Data.ModifierGroups {
		if mod["name"] == "Suhu" {
			foundMod = true
			opts := mod["options"].([]interface{})
			assert.Greater(t, len(opts), 0, "Modifier group harus meload options-nya")
		}
	}
	assert.True(t, foundMod, "Modifier group Suhu harus diload di root response")
}

// TestIntegration_ShiftSummary_ExcludesVoidedTransactions verifies that metrics
// aggregated during a live shift specifically omit voided transactions and update 
// specific 'voids' counters accurately to maintain balance consistency.
func TestIntegration_ShiftSummary_ExcludesVoidedTransactions(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	// Admin configures the shift
	outletID := InsertOutlet(t, "Outlet 1")
	userID := InsertUser(t, "kasir@test.com", domain.RoleCashier, &outletID)
	prodID := InsertProduct(t, "Kopi", 10000, 100, nil)
	
	shiftID := InsertShift(t, userID, outletID, 50000)
	token := MakeAuthToken(t, userID, "kasir@test.com", domain.RoleCashier, &outletID)

	// Checkout 1
	checkout1 := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s", "payment_method": "cash",
        "subtotal": 10000, "tax_amount": 0, "discount_amount": 0, "total_amount": 10000,
        "items": [{"product_id": "%s", "product_name": "Kopi", "quantity": 1, "unit_price": 10000, "modifiers": []}]
    }`, shiftID, outletID, prodID)
	DoRequest(t, router, "POST", "/api/v1/cashier/transactions", checkout1, token)

	// Checkout 2
	checkout2 := fmt.Sprintf(`{
        "shift_id": "%s", "outlet_id": "%s", "payment_method": "cash",
        "subtotal": 10000, "tax_amount": 0, "discount_amount": 0, "total_amount": 10000,
        "items": [{"product_id": "%s", "product_name": "Kopi", "quantity": 1, "unit_price": 10000, "modifiers": []}]
    }`, shiftID, outletID, prodID)
	wResp2 := DoRequest(t, router, "POST", "/api/v1/cashier/transactions", checkout2, token)
	
	var createResp struct {
		Data struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	json.Unmarshal(wResp2.Body.Bytes(), &createResp)

	// Void transaction 2
	wVoid := DoRequest(t, router, "POST", "/api/v1/cashier/transactions/"+createResp.Data.ID+"/void", "", token)
	require.Equal(t, http.StatusOK, wVoid.Code)

	// Get shift summary
	wSum := DoRequest(t, router, "GET", "/api/v1/cashier/shifts/current/summary", "", token)
	assert.Equal(t, http.StatusOK, wSum.Code)

	var sumResp struct {
		Data struct {
			TotalTransactions int     `json:"total_transactions"`
			CashSales         float64 `json:"cash_sales"`
			TotalVoid         float64 `json:"voids"`
		} `json:"data"`
	}
	json.Unmarshal(wSum.Body.Bytes(), &sumResp)

	assert.Equal(t, 1, sumResp.Data.TotalTransactions, "Only 1 active transaction")
	assert.Equal(t, float64(10000), sumResp.Data.CashSales, "Cash sales only 10000")
	assert.Equal(t, float64(10000), sumResp.Data.TotalVoid, "Total void is 10000")
}

// TestIntegration_DashboardSummary_FilterByOutlet evaluates whether the overarching
// admin dashboard queries accurately isolate revenue components when filtering by a specific outlet UUID.
func TestIntegration_DashboardSummary_FilterByOutlet(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outlet1 := InsertOutlet(t, "Outlet 1")
	outlet2 := InsertOutlet(t, "Outlet 2")
	
	user1 := InsertUser(t, "kasir1@test.com", domain.RoleCashier, &outlet1)
	user2 := InsertUser(t, "kasir2@test.com", domain.RoleCashier, &outlet2)
	
	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	ownerToken := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	shift1 := InsertShift(t, user1, outlet1, 0)
	shift2 := InsertShift(t, user2, outlet2, 0)

	now := time.Now()
	_, err := testDB.Exec(context.Background(), `
		INSERT INTO transactions (id, outlet_id, shift_id, payment_method, payment_status, total_amount, subtotal, order_id, created_at, updated_at) VALUES 
		($1, $2, $3, 'cash', 'paid', 15000, 15000, 'DSH-A', $4, $4),
		($5, $6, $7, 'cash', 'paid', 25000, 25000, 'DSH-B', $4, $4)
	`, uuid.New(), outlet1, shift1, now, uuid.New(), outlet2, shift2)
	require.NoError(t, err)

	w := DoRequest(t, router, "GET", "/api/v1/backoffice/dashboard/summary?outlet_id="+outlet1.String(), "", ownerToken)
	if w.Code != http.StatusOK {
		t.Logf("Error response: %s", w.Body.String())
	}
	assert.Equal(t, http.StatusOK, w.Code)
	t.Logf("Dashboard response: %s", w.Body.String())

	var sumResp struct {
		Data struct {
			Metrics struct {
				TotalRevenue float64 `json:"total_revenue"`
			} `json:"metrics"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &sumResp))
	assert.Equal(t, float64(15000), sumResp.Data.Metrics.TotalRevenue)
}

// TestIntegration_ReportTransactions_FilterByPaymentMethod verifies backend reporting filters.
// It ensures querying transaction reports with specific query parameter isolates the corresponding rows.
func TestIntegration_ReportTransactions_FilterByPaymentMethod(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outlet1 := InsertOutlet(t, "Outlet 1")
	user1 := InsertUser(t, "kasir1@test.com", domain.RoleCashier, &outlet1)
	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	ownerToken := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)
	shift1 := InsertShift(t, user1, outlet1, 0)

	now := time.Now()
	_, err := testDB.Exec(context.Background(), `
		INSERT INTO transactions (id, order_id, outlet_id, shift_id, customer_name, payment_method, payment_status, total_amount, subtotal, created_at, updated_at) VALUES 
		($1, 'A', $2, $3, 'Umum', 'cash', 'paid', 10000, 10000, $4, $4),
		($5, 'B', $2, $3, 'Umum', 'qris', 'paid', 20000, 20000, $4, $4)
	`, uuid.New(), outlet1, shift1, now, uuid.New())
	require.NoError(t, err)

	w := DoRequest(t, router, "GET", "/api/v1/backoffice/reports/transactions?payment_method=qris", "", ownerToken)
	if w.Code != http.StatusOK {
		t.Logf("Error response: %s", w.Body.String())
	}
	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data []map[string]interface{} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
	require.Equal(t, 1, len(resp.Data), "Seharusnya ada 1 QRIS transaction")
	assert.Equal(t, "qris", resp.Data[0]["payment_method"])
}

// TestIntegration_ReportShifts_FilterByCashier validates that shift history queries
// executed via backoffice can correctly filter all recorded closures generated by a specific employee.
func TestIntegration_ReportShifts_FilterByCashier(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outlet1 := InsertOutlet(t, "Outlet 1")
	user1 := InsertUser(t, "kasir1@test.com", domain.RoleCashier, &outlet1)
	user2 := InsertUser(t, "kasir2@test.com", domain.RoleCashier, &outlet1)
	
	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	ownerToken := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	InsertShift(t, user1, outlet1, 0)
	InsertShift(t, user2, outlet1, 0)

	w := DoRequest(t, router, "GET", "/api/v1/backoffice/reports/shifts?cashier_id="+user1.String(), "", ownerToken)
	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data []map[string]interface{} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
	assert.Equal(t, 1, len(resp.Data))
	assert.Equal(t, user1.String(), resp.Data[0]["user_id"])
}

// TestIntegration_ReportShiftSummary_EmptyShift ensures attempting to fetch summary aggregation
// for a shift with absolutely zero events handles zero-values transparently without crashing.
func TestIntegration_ReportShiftSummary_EmptyShift(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	outlet1 := InsertOutlet(t, "Outlet 1")
	user1 := InsertUser(t, "kasir1@test.com", domain.RoleCashier, &outlet1)
	
	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	ownerToken := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	shiftID := InsertShift(t, user1, outlet1, 0)

	w := DoRequest(t, router, "GET", "/api/v1/backoffice/reports/shifts/"+shiftID.String()+"/summary", "", ownerToken)
	assert.Equal(t, http.StatusOK, w.Code)

	var resp struct {
		Data struct {
			TotalTransactions int `json:"total_transactions"`
			TotalSales        float64 `json:"total_sales"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
	assert.Equal(t, 0, resp.Data.TotalTransactions)
	assert.Equal(t, float64(0), resp.Data.TotalSales)
}

// TestIntegration_Settings_UpdateAndGet_Consistent verifies global application singleton
// preferences correctly mutate JSON fields dynamically, and subsequent fetch operations
// yield an exactly consistent mapping of applied configurations.
func TestIntegration_Settings_UpdateAndGet_Consistent(t *testing.T) {
	ResetDB(t)
	router := BuildRouter(t)

	ownerID := InsertUser(t, "owner@test.com", domain.RoleOwner, nil)
	ownerToken := MakeAuthToken(t, ownerID, "owner@test.com", domain.RoleOwner, nil)

	payload := `{
        "receipt": {"header_text": "Toko Baru"},
        "tax": {"rate": 11.5},
        "payment": {"qris_enabled": true}
    }`

	wPut := DoRequest(t, router, "PUT", "/api/v1/backoffice/settings", payload, ownerToken)
	assert.Equal(t, http.StatusOK, wPut.Code)

	wGet := DoRequest(t, router, "GET", "/api/v1/backoffice/settings", "", ownerToken)
	assert.Equal(t, http.StatusOK, wGet.Code)

	var resp struct {
		Data struct {
			Receipt struct {
				HeaderText string `json:"header_text"`
			} `json:"receipt"`
			Tax struct {
				Rate float64 `json:"rate"`
			} `json:"tax"`
			Payment struct {
				QrisEnabled bool `json:"qris_enabled"`
			} `json:"payment"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(wGet.Body.Bytes(), &resp))
	assert.Equal(t, "Toko Baru", resp.Data.Receipt.HeaderText)
	assert.Equal(t, 11.5, resp.Data.Tax.Rate)
	assert.Equal(t, true, resp.Data.Payment.QrisEnabled)
}
