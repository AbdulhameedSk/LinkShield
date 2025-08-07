package Scam
import (
	"encoding/json"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/gin-gonic/gin"
)

//This is used to increse scam votes for URLs uses Database 3

func Vote(c *gin.Context) {
	r3 := database.CreateClient(2)
	defer r3.Close()
	var body struct {
		URL string `json:"url"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}
	val, err := r3.Get(database.Ctx, body.URL).Result()
	if err != nil {
		c.JSON(404, gin.H{"error": "URL not found or no scam data available"})
		return
	}
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(val), &data); err != nil {
		c.JSON(500, gin.H{"error": "Failed to parse scam data"})
		return
	}
	//If no error improve rating for that URL
	if rating, ok := data["rating"].(float64); ok {
		data["rating"] = rating + 1
	} else {
		data["rating"] = 1
	}

	updatedData, err := json.Marshal(data)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal updated data"})
		return
	}

	if err := r3.Set(database.Ctx, body.URL, updatedData, 0).Err(); err != nil {
		c.JSON(500, gin.H{"error": "Failed to save updated scam data"})
		return
	}

	c.JSON(200, gin.H{"message": "Scam vote updated successfully", "data": data})
}
