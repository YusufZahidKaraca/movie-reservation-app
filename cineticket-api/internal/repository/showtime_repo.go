package repository

import (
	"cineticket-api/internal/models"

	"github.com/jmoiron/sqlx"
)

type ShowTimeRepository struct {
	db *sqlx.DB
}

func NewShowTimeRepository(db *sqlx.DB) *ShowTimeRepository {
	return &ShowTimeRepository{db: db}
}

func (r *ShowTimeRepository) Create(s *models.Showtime) error {
	query := `INSERT INTO showtimes (movie_id, start_time, price)
	       VALUES ($1, $2, $3) RETURNING id `

	return r.db.QueryRow(query, s.MovieID, s.StartTime, s.Price).Scan(&s.ID)
}

func (r *ShowTimeRepository) GetByMovieID(movieID int64) ([]models.Showtime, error) {
	var showtimes []models.Showtime
	query := `SELECT * FROM showtimes WHERE movie_id = $1 ORDER BY start_time ASC`
	err := r.db.Select(&showtimes, query, movieID)
	return showtimes, err
}

// GetByID: Tek bir seansın detayını (Fiyatını öğrenmek için) çeker
func (r *ShowTimeRepository) GetByID(id int64) (*models.Showtime, error) {
	var s models.Showtime
	query := `SELECT * FROM showtimes WHERE id = $1`
	err := r.db.Get(&s, query, id)
	return &s, err
}
