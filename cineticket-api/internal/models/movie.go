package models

import "time"

type Movie struct {
	ID          int64     `db:"id" json:"id"`
	Title       string    `db:"title" json:"title"`
	Description string    `db:"description" json:"description"`
	PosterURL   string    `db:"poster_url" json:"poster_url"`
	DurationMin int       `db:"duration_min" json:"duration_min"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}
