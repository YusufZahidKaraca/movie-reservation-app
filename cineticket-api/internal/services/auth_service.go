package services

import (
	"cineticket-api/internal/dto"
	"cineticket-api/internal/mappers"
	"cineticket-api/internal/repository"
	"cineticket-api/internal/utils"
	"errors"
)

type AuthService struct {
	repo *repository.UserRepository
}

func NewAuthService(repo *repository.UserRepository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) Register(req dto.RegisterRequest) error {
	// 1. Hash
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return err
	}

	// 2. Mapping
	userModel := mappers.ToUserEntity(req, hashedPassword)

	// Save
	return s.repo.CreateUser(userModel)
}

// Login: Email ve şifre kontrolü yapar, token döner
func (s *AuthService) Login(req dto.LoginRequest) (*dto.AuthResponse, error) {
	// 1. Kullanıcıyı bul
	user, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return nil, errors.New("kullanıcı bulunamadı veya şifre hatalı") // Güvenlik için detay verme
	}

	// 2. Şifreyi kontrol et (Hash kıyaslama)
	match := utils.CheckPasswordHash(req.Password, user.PasswordHash)
	if !match {
		return nil, errors.New("kullanıcı bulunamadı veya şifre hatalı")
	}

	// 3. Token üret
	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		return nil, err
	}

	// 4. Cevabı hazırla (User Entity -> User Summary)
	return &dto.AuthResponse{
		Token: token,
		User:  mappers.ToUserSummary(user),
	}, nil
}
