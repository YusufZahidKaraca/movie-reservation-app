package dto

import "time"

// CreateShowtimeRequest: Admin seans eklerken
type CreateShowtimeRequest struct {
	MovieID   int64     `json:"movie_id" binding:"required"`
	StartTime time.Time `json:"start_time" binding:"required"` // Örn: 2024-02-05T20:00:00Z
	Price     float64   `json:"price" binding:"required,gt=0"`
}

// ShowtimeResponse: Listelerken döneceğimiz veri
type ShowtimeResponse struct {
	ID        int64     `json:"id"`
	MovieID   int64     `json:"movie_id"`
	StartTime time.Time `json:"start_time"`
	Price     float64   `json:"price"`
}
