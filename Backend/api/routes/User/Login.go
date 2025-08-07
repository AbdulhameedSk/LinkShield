package User

import (
	"encoding/json"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/abdulhameedsk/URL-Shortner/api/models"
	"github.com/abdulhameedsk/URL-Shortner/api/utils"
	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	r3 := database.CreateClient(4)
	defer r3.Close()

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	val, err := r3.Get(database.Ctx, user.Email).Result()
	if err != nil {
		c.JSON(400, gin.H{"error": "User does not exist"})
		return
	}

	var storedUser models.User
	if err := json.Unmarshal([]byte(val), &storedUser); err != nil {
		c.JSON(500, gin.H{"error": "Failed to unmarshal user data"})
		return
	}

	if storedUser.Password != user.Password {
		c.JSON(400, gin.H{"error": "Invalid password"})
		return
	}

	// ✅ Generate JWT token
	token, err := utils.GenerateToken(user.Email)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	// ✅ Do not return password
	c.JSON(200, gin.H{
		"message": "Login successful",
		"token":   token,
	})
}
