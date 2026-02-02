package services

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/mappers"
	"cineticket-api/internal/repository"
)

type MovieService struct {
	repo *repository.MovieRepository
}

func NewMovieService(repo *repository.MovieRepository) *MovieService {
	return &MovieService{repo: repo}
}

func (s *MovieService) CreateMovie(req dto.CreateMovieRequest) (*dto.MovieResponse, error) {
	// 1. Mapping
	movie := mappers.ToMovieEntity(req)

	// 2. Repo'ya kaydet (ID ve CreatedAt dolacak)
	err := s.repo.CreateMovie(movie)
	if err != nil {
		return nil, err
	}

	// 3. Cevabı hazırla
	response := mappers.ToMovieResponse(*movie)
	return &response, nil
}

func (s *MovieService) GetAllMovies() ([]dto.MovieResponse, error) {
	movies, err := s.repo.GetAllMovies()
	if err != nil {
		return nil, err
	}
	return mappers.ToMovieResponseList(movies), nil
}
