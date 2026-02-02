package mappers

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/models"
)

// ToShowtimeEntity: DTO -> Database Model
func ToShowtimeEntity(req dto.CreateShowtimeRequest) *models.Showtime {
	return &models.Showtime{
		MovieID:   req.MovieID,
		StartTime: req.StartTime,
		Price:     req.Price,
	}
}

// ToShowtimeResponse: Database Model -> Response DTO
func ToShowtimeResponse(s models.Showtime) dto.ShowtimeResponse {
	return dto.ShowtimeResponse{
		ID:        s.ID,
		MovieID:   s.MovieID,
		StartTime: s.StartTime,
		Price:     s.Price,
	}
}

// ToShowtimeResponseList: Çoklu Liste Dönüşümü
func ToShowtimeResponseList(showtimes []models.Showtime) []dto.ShowtimeResponse {
	response := make([]dto.ShowtimeResponse, len(showtimes))
	for i, s := range showtimes {
		response[i] = ToShowtimeResponse(s) // Tekli fonksiyonu tekrar kullanıyoruz
	}
	return response
}
