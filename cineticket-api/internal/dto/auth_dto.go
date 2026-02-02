package dto

// RegisterRequest: Kullanıcıdan gelen ham veri
type RegisterRequest struct {
	Fullname string `json:"fullname" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginRequest: Giriş için gereken veri
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse: Kullanıcıya döneceğimiz cevap (Şifre yok!)
type AuthResponse struct {
	Token string      `json:"token"`
	User  UserSummary `json:"user"` // İç içe obje
}

type UserSummary struct {
	ID       int64  `json:"id"`
	Fullname string `json:"fullname"`
	Email    string `json:"email"`
	Role     string `json:"role"`
}
