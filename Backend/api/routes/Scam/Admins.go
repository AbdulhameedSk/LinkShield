package Scam
import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/abdulhameedsk/URL-Shortner/api/models"
	"github.com/gin-gonic/gin"
)

func AddAdmin(c *gin.Context) {
	var admin models.Admin

	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	r3 := database.CreateClient(3)
	defer r3.Close()

	adminData, err := json.Marshal(admin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serialize admin data"})
		return
	}

	key := fmt.Sprintf("admin:%s", admin.Email)

	// Prevent duplicate admin
	exists, _ := r3.Exists(database.Ctx, key).Result()
	if exists == 1 {
		c.JSON(http.StatusConflict, gin.H{"error": "Admin already exists"})
		return
	}

	if err := r3.Set(database.Ctx, key, adminData, 0).Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store admin data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Admin added successfully", "data": admin})
}
