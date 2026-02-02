package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// GenerateToken: Kullanıcı ID ve Rolü ile token oluşturur
func GenerateToken(userID int64, role string) (string, error) {
	//1. env
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", errors.New("JWT_SECRET bulunamadı")
	}

	// 2. Claims
	claims := jwt.MapClaims{
		"user_id": userID,
		"role":    role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // 24 hour valid
	}

	// 3. signature token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(secret))

	return signedToken, err
}

// ValidateToken: Gelen token string'ini çözer ve içindeki bilgileri döner
func ValidateToken(tokenString string) (int64, string, error) {
	secret := os.Getenv("JWT_SECRET")

	// Token'ı parse et (çözümle)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Algoritma kontrolü (HMAC mı?) - Güvenlik kuralı
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("beklenmeyen imza yöntemi")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return 0, "", err
	}

	// Token geçerli mi ve içindeki veriler (Claims) okunabiliyor mu?
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// JSON sayılar float64 olarak gelir, int64'e çeviriyoruz
		userID := int64(claims["user_id"].(float64))
		role := claims["role"].(string)
		return userID, role, nil
	}

	return 0, "", errors.New("geçersiz token")
}
