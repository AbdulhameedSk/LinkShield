package Scam

import (
	"encoding/json"
	"net/http"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/abdulhameedsk/URL-Shortner/api/models"
	"github.com/gin-gonic/gin"
)

func VerifyScamByAdmin(c *gin.Context) {
	r3 := database.CreateClient(3)
	defer r3.Close()

	var body struct {
		Email string `json:"email"` // admin email
		URL   string `json:"url"`   // scam to verify
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	key := "admin:" + body.Email
	val, err := r3.Get(database.Ctx, key).Result()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	var admin models.Admin
	if err := json.Unmarshal([]byte(val), &admin); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse admin data"})
		return
	}

	// Check if URL is already verified
	for _, url := range admin.VerifiedURLs {
		if url == body.URL {
			c.JSON(http.StatusOK, gin.H{"message": "URL already verified by admin"})
			return
		}
	}

	// Add URL to verified list
	admin.VerifiedURLs = append(admin.VerifiedURLs, body.URL)

	adminData, err := json.Marshal(admin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update admin data"})
		return
	}

	if err := r3.Set(database.Ctx, key, adminData, 0).Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save updated admin data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "URL verified successfully", "verified_urls": admin.VerifiedURLs})
}
