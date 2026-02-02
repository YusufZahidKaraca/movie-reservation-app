package dto

import "time"

// CreateMovieRequest: Admin film eklerken bunu gönderecek
type CreateMovieRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	PosterURL   string `json:"poster_url"`
	DurationMin int    `json:"duration_min" binding:"required,gt=0"` // 0'dan büyük olmalı
}

// MovieResponse: Kullanıcıya döneceğimiz film verisi
type MovieResponse struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	PosterURL   string    `json:"poster_url"`
	DurationMin int       `json:"duration_min"`
	CreatedAt   time.Time `json:"created_at"`
}
