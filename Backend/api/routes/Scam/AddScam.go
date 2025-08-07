package Scam

import (
	"encoding/json"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/abdulhameedsk/URL-Shortner/api/models"
	"github.com/gin-gonic/gin"
)

func AddScam(c *gin.Context) {
	var scam models.Scam
	if err := c.ShouldBindJSON(&scam); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	r3 := database.CreateClient(2)
	defer r3.Close()

	// Check if scam info already exists for this URL
	val, err := r3.Get(database.Ctx, scam.URL).Result()
	var data map[string]interface{}

	if err == nil {
		// If it exists, unmarshal existing JSON
		if err := json.Unmarshal([]byte(val), &data); err != nil {
			c.JSON(500, gin.H{"error": "Failed to parse existing scam data"})
			return
		}
	} else {
		// If it doesn't exist, start fresh
		data = make(map[string]interface{})
	}

	// Add/update description and increment rating
	data["description"] = scam.Description
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

	if err := r3.Set(database.Ctx, scam.URL, updatedData, 0).Err(); err != nil {
		c.JSON(500, gin.H{"error": "Failed to save scam data"})
		return
	}

	c.JSON(200, gin.H{"message": "Scam added successfully", "data": data})
}
