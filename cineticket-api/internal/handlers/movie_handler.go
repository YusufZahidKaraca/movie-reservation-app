package handlers

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/services"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MovieHandler struct {
	service *services.MovieService
}

func NewMovieHandler(service *services.MovieService) *MovieHandler {
	return &MovieHandler{service: service}
}

// CreateMovie (Sadece Adminler erişecek)
func (h *MovieHandler) CreateMovie(c *gin.Context) {
	var req dto.CreateMovieRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := h.service.CreateMovie(req)
	if err != nil {
		// 👇 BURAYI EKLE: Hatanın aslını terminale yazdır
		fmt.Println("❌ KRİTİK HATA:", err)

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Film eklenirken hata oluştu"})
		return
	}

	c.JSON(http.StatusCreated, res)
}

// GetMovies (Herkes erişebilir)
func (h *MovieHandler) GetMovies(c *gin.Context) {
	movies, err := h.service.GetAllMovies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Filmler getirilemedi"})
		return
	}
	c.JSON(http.StatusOK, movies)
}
