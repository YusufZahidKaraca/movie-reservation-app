package mappers

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/models"
)

// ToTicketResponse: Veritabanı modeli ve fiyat bilgisini alıp, DTO'ya çevirir
func ToTicketResponse(ticket *models.Ticket, amount float64) *dto.TicketResponse {
	return &dto.TicketResponse{
		ID:            ticket.ID,
		SeatNumber:    ticket.SeatNumber,
		ShowtimeID:    ticket.ShowtimeID,
		PaymentStatus: "SUCCESS", // Şimdilik sabit, normalde payment tablosundan gelir
		Amount:        amount,
	}
}
