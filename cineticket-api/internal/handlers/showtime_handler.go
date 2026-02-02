package handlers

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ShowtimeHandler struct {
	service *services.ShowtimeService
}

func NewShowtimeHandler(service *services.ShowtimeService) *ShowtimeHandler {
	return &ShowtimeHandler{service: service}
}

func (h *ShowtimeHandler) Create(c *gin.Context) {
	var req dto.CreateShowtimeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateShowtime(req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Seans eklenemedi"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Seans eklendi"})
}

// GET /movies/:id/showtimes
func (h *ShowtimeHandler) ListByMovie(c *gin.Context) {
	// URL'den ID'yi al (String gelir, int'e çeviririz)
	idStr := c.Param("id")
	movieID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz film ID'si"})
		return
	}

	res, err := h.service.GetShowtimes(movieID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Seanslar getirilemedi"})
		return
	}
	c.JSON(http.StatusOK, res)
}
