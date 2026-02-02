package middleware

import (
	"cineticket-api/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware: Token kontrolü yapan fonksiyon
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. headerdan token al
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization başlığı eksik"})
			c.Abort()
			return
		}

		// Format kontrlü (Bearer <token>)
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz token formatı (Bearer Token olmalı)"})
			c.Abort()
			return
		}

		// 3. Tokenı doğrula
		tokenString := parts[1]
		userID, role, err := utils.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz veya süresi dolmuş token"})
			c.Abort()
			return
		}

		// 4. Bilgileri Context'e kaydet (Handler'da kullanmak için)
		c.Set("userID", userID)
		c.Set("role", role)

		// next
		c.Next()

	}
}

// AdminMiddleware: Sadece Adminlerin girmesine izin verir
// Not: Bu middleware, AuthMiddleware'den SONRA çağrılmalı!
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Bu işlem için yetkiniz yok (Admin only)"})
			c.Abort()
			return
		}
		c.Next()
	}
}
