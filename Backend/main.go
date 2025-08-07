package main

import (
	"log"
	"os"

	"github.com/abdulhameedsk/URL-Shortner/api/middleware"
	"github.com/abdulhameedsk/URL-Shortner/api/routes/Scam"
	"github.com/abdulhameedsk/URL-Shortner/api/routes/User"
	"github.com/abdulhameedsk/URL-Shortner/api/routes/shorten"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	router := gin.Default()
	setupRouters(router)
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(router.Run(":" + port)) //fatal is used to To log the error and stop the app if starting the server fails and we use ":" to with out : This tries to bind to a UNIX socket named "8080", not a TCP port! That's not what you want.:8080 tells Gin to listen on TCP port 8080 on all interfaces (i.e., 0.0.0.0:8080).This is the correct way to start an HTTP server on a specific port.

}

func setupRouters(router *gin.Engine) {
	router.POST("/signup", User.Signup)
	router.POST("/login", User.Login)

	// ✅ Public Routes — No auth needed
	router.POST("/api/v1", shorten.ShortenURL)
	router.GET("/api/v1/:shortID", shorten.GetByShortID)
	router.GET("/api/v1/getVerifiedScams", Scam.GetVerifiedScams)
	router.GET("/api/v1/GetScams", Scam.GetScams)

	// ✅ Protected Routes — Require JWT
	protected := router.Group("/api/v1")
	protected.Use(middleware.JWTAuthMiddleware())

	protected.PUT("/:shortID", shorten.EditURL)
	protected.DELETE("/:shortID", shorten.DeleteURL)
	protected.POST("/addTag", shorten.AddTag)
	protected.POST("/addAdmin", Scam.AddAdmin)
	protected.POST("/AddScams", Scam.AddScam)
	protected.POST("/vote", Scam.Vote)
	protected.POST("/verifyScamByAdmin", Scam.VerifyScamByAdmin)
}
