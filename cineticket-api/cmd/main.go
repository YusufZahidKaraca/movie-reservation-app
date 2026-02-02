package main

import (
	"log"

	"cineticket-api/internal/database"
	"cineticket-api/internal/handlers"
	"cineticket-api/internal/middleware" // Middleware import et
	"cineticket-api/internal/repository"
	"cineticket-api/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. DB Bağlantısı
	db, err := database.Connect()
	if err != nil {
		log.Fatalf("Veritabanı hatası: %v", err)
	}

	// --- DEPENDENCY INJECTION ---
	// User
	userRepo := repository.NewUserRepository(db)
	authService := services.NewAuthService(userRepo)
	authHandler := handlers.NewAuthHandler(authService)

	// Movie
	movieRepo := repository.NewMovieRepository(db)
	movieService := services.NewMovieService(movieRepo)
	movieHandler := handlers.NewMovieHandler(movieService)

	// SHOWTIME DI
	showtimeRepo := repository.NewShowTimeRepository(db)
	showtimeService := services.NewShowtimeService(showtimeRepo)
	showtimeHandler := handlers.NewShowtimeHandler(showtimeService)

	// TICKET DI
	ticketRepo := repository.NewTicketRepository(db)
	// Not: showtimeRepo zaten yukarıda vardı, onu kullanıyoruz
	ticketService := services.NewTicketService(ticketRepo, showtimeRepo)
	ticketHandler := handlers.NewTicketHandler(ticketService)

	r := gin.Default()

	// 👇 CORS AYARI (Frontend'e izin ver)
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"} // React'in adresi
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"} // Token header'ına izin ver
	r.Use(cors.New(config))

	// 1. AUTH ROTALARI (Public)
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
	}

	// 2. API ROTALARI
	api := r.Group("/api")

	// A) Herkesin görebileceği rotalar
	api.GET("/movies", movieHandler.GetMovies)
	api.GET("/movies/:id/showtimes", showtimeHandler.ListByMovie)
	api.GET("/showtimes/:id/booked-seats", ticketHandler.GetBookedSeats)

	// B) Sadece Giriş Yapmış Kullanıcılar (User + Admin)
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/profile", func(c *gin.Context) {})
		protected.POST("/tickets/buy", ticketHandler.BuyTicket)
		protected.GET("/tickets/my-tickets", ticketHandler.GetMyTickets)
	}

	// C) SADECE ADMIN ROTALARI 👮‍♂️
	admin := api.Group("/admin")
	// Önce Token var mı bak, Sonra Admin mi bak? (Zincirleme Middleware)
	admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
	{
		admin.POST("/movies", movieHandler.CreateMovie)
		admin.POST("/showtimes", showtimeHandler.Create)
	}

	r.Run(":8080")
}
