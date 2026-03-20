package domain

import "github.com/google/uuid"

// ModifierGroup is a set of customization options (e.g., Size, Sugar Level).
type ModifierGroup struct {
	ID       uuid.UUID        `json:"id"`
	Name     string           `json:"name"`
	Required bool             `json:"required"`
	Options  []ModifierOption `json:"options,omitempty"`
}

// ModifierOption is a single choice within a modifier group.
type ModifierOption struct {
	ID              uuid.UUID `json:"id"`
	ModifierGroupID uuid.UUID `json:"modifier_group_id"`
	Name            string    `json:"name"`
	PriceImpact     float64   `json:"price_impact"`
	SortOrder       int       `json:"sort_order"`
}

// SelectedModifier is a modifier choice recorded in a transaction item.
type SelectedModifier struct {
	GroupName      string  `json:"group_name"`
	SelectedOption string  `json:"selected_option"`
	PriceImpact    float64 `json:"price_impact"`
}
