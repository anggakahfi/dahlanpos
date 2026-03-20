package handler

import (
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
)

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
func RespondPaginated(c *gin.Context, data interface{}, page, perPage int, total int64) {
	totalPages := int(math.Ceil(float64(total) / float64(perPage)))
	c.JSON(http.StatusOK, APIResponse{
		Success: true,
		Data:    data,
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
