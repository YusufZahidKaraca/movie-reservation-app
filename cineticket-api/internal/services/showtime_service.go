package services

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/mappers" // Mapper'ı import et
	"cineticket-api/internal/repository"
)

type ShowtimeService struct {
	repo *repository.ShowTimeRepository
}

func NewShowtimeService(repo *repository.ShowTimeRepository) *ShowtimeService {
	return &ShowtimeService{repo: repo}
}

func (s *ShowtimeService) CreateShowtime(req dto.CreateShowtimeRequest) error {
	// Mapper kullanıyoruz
	showtime := mappers.ToShowtimeEntity(req)
	return s.repo.Create(showtime)
}

func (s *ShowtimeService) GetShowtimes(movieID int64) ([]dto.ShowtimeResponse, error) {
	data, err := s.repo.GetByMovieID(movieID)
	if err != nil {
		return nil, err
	}

	return mappers.ToShowtimeResponseList(data), nil
}
