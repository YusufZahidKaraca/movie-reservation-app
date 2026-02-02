package models

import (
	"time"
)

type User struct {
	ID           int64     `db:"id" json: "id"`
	Fullname     string    `db:"fullname" json:"fullname"`
	Email        string    `db:"email" json:"email"`
	PasswordHash string    `db:"password_hash" json:"password_hash"`
	Role         string    `db:"role" json:"role"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
}
