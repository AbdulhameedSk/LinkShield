package utils

import (
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func IsDifferentDomain(url string) bool {
	domain := os.Getenv("DOMAIN")
	if url == domain {
		return false
	}
	cleanURL := strings.TrimPrefix(url, "http://")
	cleanURL = strings.TrimPrefix(cleanURL, "https://")
	cleanURL = strings.TrimPrefix(cleanURL, "www.")
	cleanURL = strings.Split(cleanURL, "/")[0]
	return cleanURL != domain
}

func EnsureHTTPPrefix(url string) string {
	if !strings.HasPrefix(url, "http://") || !strings.HasPrefix(url, "https://") {
		return "http://" + url
	}
	return url
}

var jwtsecret = []byte(os.Getenv("jwt_secret"))

func GenerateToken(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(72 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtsecret)
}
