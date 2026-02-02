package dto

type BuyTicketRequest struct {
	ShowtimeID int64  `json:"showtime_id" binding:"required"`
	SeatNumber int    `json:"seat_number" binding:"required,min=1,max=100"` // Koltuk 1-100 arası
	CardNumber string `json:"card_number" binding:"required,len=16"`        // Sahte kart no
}

type TicketResponse struct {
	ID            int64   `json:"ticket_id"`
	SeatNumber    int     `json:"seat_number"`
	ShowtimeID    int64   `json:"showtime_id"`
	PaymentStatus string  `json:"payment_status"`
	Amount        float64 `json:"amount"`
}

type TicketDetail struct {
	ID         int64   `db:"id" json:"id"`
	MovieTitle string  `db:"title" json:"movie_title"`
	PosterURL  string  `db:"poster_url" json:"poster_url"`
	StartTime  string  `db:"start_time" json:"start_time"` // time.Time yerine string dönebilir sqlx
	SeatNumber int     `db:"seat_number" json:"seat_number"`
	Price      float64 `db:"price" json:"price"` // showtimes tablosundan gelebilir
}
