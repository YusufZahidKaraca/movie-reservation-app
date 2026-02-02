package models

import "time"

type Showtime struct {
	ID        int64     `db:"id" json:"id"`
	MovieID   int64     `db:"movie_id" json:"movie_id"`
	StartTime time.Time `db:"start_time" json:"start_time"`
	Price     float64   `db:"price" json:"price"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}
