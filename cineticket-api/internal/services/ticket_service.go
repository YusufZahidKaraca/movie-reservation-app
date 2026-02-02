package services

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/mappers" // Mapper import edildi
	"cineticket-api/internal/repository"
	"errors"
)

type TicketService struct {
	ticketRepo   *repository.TicketRepository
	showtimeRepo *repository.ShowTimeRepository
}

func NewTicketService(tRepo *repository.TicketRepository, sRepo *repository.ShowTimeRepository) *TicketService {
	return &TicketService{ticketRepo: tRepo, showtimeRepo: sRepo}
}

func (s *TicketService) BuyTicket(userID int64, req dto.BuyTicketRequest) (*dto.TicketResponse, error) {
	// 1. ÖNCE SEANSI BUL VE FİYATINI ÖĞREN
	showtime, err := s.showtimeRepo.GetByID(req.ShowtimeID)
	if err != nil {
		return nil, errors.New("seans bulunamadı") // Geçersiz ID gelirse patlamasın
	}

	// Gerçek fiyatı aldık!
	realPrice := showtime.Price

	// 2. Repo işlemini gerçek fiyatla yap
	ticket, err := s.ticketRepo.BuyTicket(userID, req.ShowtimeID, req.SeatNumber, realPrice)
	if err != nil {
		return nil, err
	}

	// 3. Mapping
	return mappers.ToTicketResponse(ticket, realPrice), nil
}

func (s *TicketService) GetBookedSeats(showtimeID int64) ([]int, error) {
	// Repository'deki fonksiyonu çağırıp sonucu yukarı (Handler'a) paslıyor
	return s.ticketRepo.GetBookedSeats(showtimeID)
}

func (s *TicketService) GetMyTickets(userID int64) ([]dto.TicketDetail, error) {
	return s.ticketRepo.GetTicketsByUserID(userID)
}
