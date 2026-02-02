package handlers

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/services"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type TicketHandler struct {
	service *services.TicketService
}

func NewTicketHandler(service *services.TicketService) *TicketHandler {
	return &TicketHandler{service: service}
}

func (h *TicketHandler) BuyTicket(c *gin.Context) {
	// Middleware'den UserID'yi al
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	var req dto.BuyTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Service'i çağır (userID interface{} olduğu için int64'e çeviriyoruz)
	res, err := h.service.BuyTicket(userID.(int64), req)
	if err != nil {
		fmt.Println("❌ BİLET ALMA HATASI:", err)
		c.JSON(http.StatusConflict, gin.H{"error": "Bu koltuk dolu veya işlem başarısız"})
		return
	}

	c.JSON(http.StatusCreated, res)
}

func (h *TicketHandler) GetBookedSeats(c *gin.Context) {
	// 1. URL'den ID'yi al (string olarak gelir)
	idStr := c.Param("id")

	// 2. int64'e çevir (Senin yapın int64 kullanıyor)
	showtimeID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz Seans ID"})
		return
	}

	// 3. Service'i çağır (İş mantığı)
	seats, err := h.service.GetBookedSeats(showtimeID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Koltuk bilgisi alınamadı"})
		return
	}

	// 4. Eğer hiç koltuk satılmamışsa 'seats' nil olabilir, boş diziye çevirelim ki JSON [] dönsün
	if seats == nil {
		seats = []int{}
	}

	// 5. Cevabı dön: [1, 5, 23] gibi
	c.JSON(200, seats)
}

func (h *TicketHandler) GetMyTickets(c *gin.Context) {
	// Middleware'in context'e koyduğu userID'yi al
	// (Auth middleware'in 'userID' key'i ile kaydettiğini varsayıyoruz)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(401, gin.H{"error": "Yetkisiz işlem"})
		return
	}

	// Gelen değer float64 veya int olabilir, cast edelim
	// (JWT kütüphanene göre değişir, genelde float64 gelir json'dan)
	uid := userID.(int64)

	tickets, err := h.service.GetMyTickets(uid)
	if err != nil {
		c.JSON(500, gin.H{"error": "Biletler yüklenemedi"})
		return
	}

	// Eğer hiç bilet yoksa boş array dön (null dönmesin)
	if tickets == nil {
		tickets = []dto.TicketDetail{}
	}

	c.JSON(200, tickets)
}
