package repository

import (
	"cineticket-api/internal/models"

	"github.com/jmoiron/sqlx"
)

type MovieRepository struct {
	db *sqlx.DB
}

func NewMovieRepository(db *sqlx.DB) *MovieRepository {
	return &MovieRepository{db: db}
}

// CreateMovie: Yeni film ekler
func (r *MovieRepository) CreateMovie(m *models.Movie) error {
	query := `
        INSERT INTO movies (title, description, poster_url, duration_min)
        VALUES ($1, $2, $3, $4)  
        RETURNING id, created_at
    `
	// VALUES kısmında $1, $2... kullandığına emin ol (Dolar işareti)
	return r.db.QueryRow(query, m.Title, m.Description, m.PosterURL, m.DurationMin).Scan(&m.ID, &m.CreatedAt)
}

// GetAllMovies: Tüm filmleri listeler
func (r *MovieRepository) GetAllMovies() ([]models.Movie, error) {
	var movies []models.Movie

	query := "SELECT * FROM movies ORDER BY created_at DESC"
	err := r.db.Select(&movies, query)
	return movies, err
}
