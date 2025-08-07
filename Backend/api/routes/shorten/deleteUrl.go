package shorten

import (
	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/gin-gonic/gin"
)

func DeleteURL(c *gin.Context) {
	shortID := c.Param("shortID")
	r := database.CreateClient(0)
	defer r.Close()
	if err := r.Del(database.Ctx, shortID).Err(); err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete URL"})
		return
	}
	c.JSON(200, gin.H{"message": "URL deleted successfully"})
}
