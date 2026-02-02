package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// HashPassword: Düz şifreyi alır, hashlenmiş halini döner
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("şifre hashlenemedi: %w", err)
	}
	return string(bytes), nil
}

// CheckPasswordHash: Login sırasında şifre kontrolü yapar
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
