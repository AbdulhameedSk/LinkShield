package Scam
import (
	"encoding/json"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/gin-gonic/gin"
)
func GetScams(c *gin.Context) {
	r3 := database.CreateClient(2)
	defer r3.Close()

	// Fetch all keys
	keys, err := r3.Keys(database.Ctx, "*").Result()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to retrieve scam keys"})
		return
	}

	if len(keys) == 0 {
		c.JSON(404, gin.H{"message": "No scams found"})
		return
	}

	var scamdetails []map[string]interface{}
	for _, key := range keys {
		val, err := r3.Get(database.Ctx, key).Result()
		if err != nil {
			continue 
		}
		var scam map[string]interface{}
		if err := json.Unmarshal([]byte(val), &scam); err != nil {
			continue
		}
		scam["url"] = key 
		scamdetails = append(scamdetails, scam)
	}

	if len(scamdetails) == 0 {
		c.JSON(404, gin.H{"message": "No valid scam records found"})
		return
	}

	c.JSON(200, gin.H{"scams": scamdetails})
}
