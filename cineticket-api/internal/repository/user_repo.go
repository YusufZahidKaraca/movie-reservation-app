package repository

import (
	"cineticket-api/internal/models"

	"github.com/jmoiron/sqlx"
)

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(u *models.User) error {
	query := `INSERT INTO users(fullname, email, password_hash, role)
	       VALUES($1, $2, $3, 'user') 
		   RETURNING id, created_at`

	err := r.db.QueryRow(query, u.Fullname, u.Email, u.PasswordHash).Scan(&u.ID, &u.CreatedAt)
	return err

}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User

	query := `SELECT * FROM users WHERE email = $1`

	err := r.db.Get(&user, query, email)
	return &user, err
}
