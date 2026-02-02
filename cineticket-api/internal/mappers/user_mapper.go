package mappers

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/models"
)

// ToUserEntity: RegisterRequest'i veritabanı modeline çevirir
// Not: PasswordHash'i dışarıdan alıyoruz çünkü service katmanında hash'lenecek
func ToUserEntity(req dto.RegisterRequest, passwordHash string) *models.User {
	return &models.User{
		Fullname:     req.Fullname,
		Email:        req.Email,
		PasswordHash: passwordHash,
		Role:         "user", // Varsayılan rol
	}
}

// ToUserSummary: Veritabanı modelini frontend'e gidecek sade objeye çevirir
func ToUserSummary(user *models.User) dto.UserSummary {
	return dto.UserSummary{
		ID:       user.ID,
		Fullname: user.Fullname,
		Email:    user.Email,
		Role:     user.Role,
	}
}
