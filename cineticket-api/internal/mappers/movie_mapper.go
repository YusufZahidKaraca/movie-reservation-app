package mappers

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/models"
)

// ToMovieEntity: Request -> Model
func ToMovieEntity(req dto.CreateMovieRequest) *models.Movie {
	return &models.Movie{
		Title:       req.Title,
		Description: req.Description,
		PosterURL:   req.PosterURL,
		DurationMin: req.DurationMin,
	}
}

// ToMovieResponse: Model -> Response
func ToMovieResponse(m models.Movie) dto.MovieResponse {
	return dto.MovieResponse{
		ID:          m.ID,
		Title:       m.Title,
		Description: m.Description,
		PosterURL:   m.PosterURL,
		DurationMin: m.DurationMin,
		CreatedAt:   m.CreatedAt,
	}
}

// ToMovieResponseList: Çoklu film listesini çevirmek için
func ToMovieResponseList(movies []models.Movie) []dto.MovieResponse {
	response := make([]dto.MovieResponse, len(movies))
	for i, m := range movies {
		response[i] = ToMovieResponse(m)
	}
	return response
}
