package User

import (
	"encoding/json"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/abdulhameedsk/URL-Shortner/api/models"
	"github.com/gin-gonic/gin"
	"github.com/abdulhameedsk/URL-Shortner/api/utils"
)

func Signup(c *gin.Context) {
	r3 := database.CreateClient(4)
	defer r3.Close()

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	_, err := r3.Get(database.Ctx, user.Email).Result()
	if err == nil {
		c.JSON(400, gin.H{"error": "User already exists"})
		return
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal user data"})
		return
	}

	if err := r3.Set(database.Ctx, user.Email, userJSON, 0).Err(); err != nil {
		c.JSON(500, gin.H{"error": "Failed to create user"})
		return
	}

	// ✅ Generate JWT token after user creation
	token, err := utils.GenerateToken(user.Email)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(200, gin.H{
		"message": "User created successfully",
		"token":   token,
	})
}
