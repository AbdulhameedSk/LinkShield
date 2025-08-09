package main

import (
	"log"
	"os"
	"time"

	"github.com/abdulhameedsk/URL-Shortner/api/middleware"
	"github.com/abdulhameedsk/URL-Shortner/api/routes/Scam"
	"github.com/abdulhameedsk/URL-Shortner/api/routes/User"
	"github.com/abdulhameedsk/URL-Shortner/api/routes/shorten"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println(".env not loaded (continuing):", err)
	}

	// Gin with logger & recovery
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())

	// CORS so frontend (Vite default 5173) can call API
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	setupRouters(router)

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8000" // default aligned with docker-compose & frontend axios
	}
	log.Printf("Starting server on :%s", port)
	log.Fatal(router.Run(":" + port))
}

func setupRouters(router *gin.Engine) {
	// Auth
	router.POST("/signup", User.Signup)
	router.POST("/login", User.Login)

	// Public URL & scam routes
	router.POST("/api/v1", shorten.ShortenURL)
	router.GET("/api/v1/:shortID", shorten.GetByShortID)
	router.GET("/api/v1/getVerifiedScams", Scam.GetVerifiedScams)
	router.GET("/api/v1/GetScams", Scam.GetScams)

	// Protected (JWT)
	protected := router.Group("/api/v1")
	protected.Use(middleware.JWTAuthMiddleware())
	protected.PUT("/:shortID", shorten.EditURL)      // fixed path
	protected.DELETE("/:shortID", shorten.DeleteURL) // fixed path
	protected.POST("/addTag", shorten.AddTag)
	protected.POST("/addAdmin", Scam.AddAdmin)
	protected.POST("/AddScams", Scam.AddScam)
	protected.POST("/vote", Scam.Vote)
	protected.POST("/verifyScamByAdmin", Scam.VerifyScamByAdmin)
}
