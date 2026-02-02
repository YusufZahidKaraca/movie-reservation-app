package models

import "time"

type Payment struct {
	ID            int64     `db:"id"`
	UserID        int64     `db:"user_id"`
	Amount        float64   `db:"amount"`
	PaymentStatus string    `db:"payment_status"`
	TransactionID string    `db:"transaction_id"`
	CreatedAt     time.Time `db:"created_at"`
}

type Ticket struct {
	ID         int64     `db:"id"`
	UserID     int64     `db:"user_id"`
	ShowtimeID int64     `db:"showtime_id"`
	PaymentID  int64     `db:"payment_id"`
	SeatNumber int       `db:"seat_number"`
	CreatedAt  time.Time `db:"purchase_time"`
}
