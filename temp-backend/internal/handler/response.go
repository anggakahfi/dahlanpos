package handler

import (
	"math"
	"net/http"
	"reflect"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// parseUUIDParam parses a UUID from a path parameter and sends a 400 error if invalid.
// BUG-15 FIX: Returns false if the UUID is malformed, preventing operations with zero UUIDs.
func parseUUIDParam(c *gin.Context, paramName string) (uuid.UUID, bool) {
	id, err := uuid.Parse(c.Param(paramName))
	if err != nil {
		RespondError(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid "+paramName+" format")
		return uuid.Nil, false
	}
	return id, true
}

// APIResponse is the standardized JSON envelope for all API responses.
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
	Error   *APIError   `json:"error,omitempty"`
}

// Meta contains pagination metadata.
type Meta struct {
	Page       int   `json:"page"`
	PerPage    int   `json:"per_page"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

// APIError is the standardized error payload.
type APIError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// RespondSuccess sends a successful JSON response.
func RespondSuccess(c *gin.Context, status int, data interface{}) {
	c.JSON(status, APIResponse{Success: true, Data: data})
}

// RespondPaginated sends a successful paginated JSON response.
// It ensures that nil slices are serialized as [] instead of null.
func RespondPaginated(c *gin.Context, data interface{}, page, perPage int, total int64) {
	totalPages := int(math.Ceil(float64(total) / float64(perPage)))

	// Ensure nil slices become empty slices so JSON encodes as [] not null
	safeData := data
	if data == nil {
		safeData = []interface{}{}
	} else {
		v := reflect.ValueOf(data)
		if v.Kind() == reflect.Slice && v.IsNil() {
			safeData = []interface{}{}
		}
	}

	c.JSON(http.StatusOK, APIResponse{
		Success: true,
		Data:    safeData,
		Meta: &Meta{
			Page:       page,
			PerPage:    perPage,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

// RespondError sends an error JSON response.
func RespondError(c *gin.Context, status int, code, message string) {
	c.JSON(status, APIResponse{
		Success: false,
		Error:   &APIError{Code: code, Message: message},
	})
}
