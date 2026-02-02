package repository

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/models"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type TicketRepository struct {
	db *sqlx.DB
}

func NewTicketRepository(db *sqlx.DB) *TicketRepository {
	return &TicketRepository{db: db}
}

// CreateTicketWithPayment: Hem ödemeyi hem bileti tek seferde (Transaction ile) halleder
func (r *TicketRepository) BuyTicket(userID int64, showtimeID int64, seatNumber int, amount float64) (*models.Ticket, error) {
	// 1. Transaction Başlat (Ya hep ya hiç!)
	tx, err := r.db.Beginx()
	if err != nil {
		return nil, err
	}
	// Fonksiyon bitince hata varsa Rollback (Geri al), yoksa Commit (Onayla)
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback() // Hata varsa her şeyi geri al
		} else {
			err = tx.Commit() // Her şey yolundaysa kaydet
		}
	}()

	// 2. Ödemeyi Kaydet
	var paymentID int64
	paymentQuery := `INSERT INTO payments (user_id, amount, transaction_id) 
                     VALUES ($1, $2, 'TRX-123456') RETURNING id`

	err = tx.QueryRow(paymentQuery, userID, amount).Scan(&paymentID)
	if err != nil {
		return nil, fmt.Errorf("ödeme kaydedilemedi: %v", err)
	}

	// 3. Bileti Oluştur
	var ticket models.Ticket
	ticketQuery := `INSERT INTO tickets (user_id, showtime_id, payment_id, seat_number) 
                    VALUES ($1, $2, $3, $4) 
                    RETURNING id, purchase_time`

	err = tx.QueryRow(ticketQuery, userID, showtimeID, paymentID, seatNumber).Scan(&ticket.ID, &ticket.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("koltuk dolu veya hata oluştu: %v", err)
	}

	// Struct'ı doldur
	ticket.UserID = userID
	ticket.ShowtimeID = showtimeID
	ticket.PaymentID = paymentID
	ticket.SeatNumber = seatNumber

	return &ticket, nil
}

// GetBookedSeats: Belirli bir seans için satılmış koltuk numaralarını getirir
func (r *TicketRepository) GetBookedSeats(showtimeID int64) ([]int, error) {
	// Sonuçları tutacak boş bir liste (slice) oluşturuyoruz
	var seats []int

	// Basit SQL sorgusu: O showtime_id'ye ait tüm seat_number'ları ver
	query := `SELECT seat_number FROM tickets WHERE showtime_id = $1`

	err := r.db.Select(&seats, query, showtimeID)

	if err != nil {
		return nil, err
	}

	return seats, nil
}

// GetTicketsByUserID: Kullanıcının biletlerini getir
func (r *TicketRepository) GetTicketsByUserID(userID int64) ([]dto.TicketDetail, error) {
	var tickets []dto.TicketDetail

	// 3 Tabloyu Birleştiren SQL (JOIN)
	query := `
        SELECT 
            t.id, 
            m.title, 
            m.poster_url, 
            s.start_time,
            s.price, 
            t.seat_number
        FROM tickets t
        JOIN showtimes s ON t.showtime_id = s.id
        JOIN movies m ON s.movie_id = m.id
        WHERE t.user_id = $1
        ORDER BY s.start_time DESC
    `

	err := r.db.Select(&tickets, query, userID)
	return tickets, err
}
