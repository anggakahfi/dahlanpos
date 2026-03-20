package domain

// Settings is a singleton configuration record (1 row in the DB).
type Settings struct {
	Payment SettingsPayment `json:"payment"`
	Tax     SettingsTax     `json:"tax"`
	Receipt SettingsReceipt `json:"receipt"`
}

// SettingsPayment controls which payment methods are available at the cashier.
type SettingsPayment struct {
	CashEnabled bool `json:"cash_enabled"`
	QRISEnabled bool `json:"qris_enabled"`
}

// SettingsTax controls tax calculation behavior.
type SettingsTax struct {
	Enabled bool    `json:"enabled"`
	Rate    float64 `json:"rate"`
	Name    string  `json:"name"`
	Type    string  `json:"type"` // "exclusive" or "inclusive"
}

// SettingsReceipt controls receipt appearance.
type SettingsReceipt struct {
	LogoURL          string `json:"logo_url"`
	HeaderText       string `json:"header_text"`
	FooterMessage    string `json:"footer_message"`
	ShowTaxBreakdown bool   `json:"show_tax_breakdown"`
}
