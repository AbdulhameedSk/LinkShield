package Scam
import (
	"encoding/json"
	"net/http"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/abdulhameedsk/URL-Shortner/api/models"
	"github.com/gin-gonic/gin"
)

// This is used to get verified scams from Database 3
// Go to DB3 and retrieve all urls from admins data
func GetVerifiedScams(c *gin.Context) {
	r3 := database.CreateClient(3)
	defer r3.Close()
	//Go into r3 and get all URLs from admins data
	keys, err := r3.Keys(database.Ctx, "admin:*").Result()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot find admins",
		})
	}
	//Go does not have builtin Set Data Structure
	UniqueScamUrls := make(map[string]bool)
	for _, key := range keys {
		val, err := r3.Get(database.Ctx, key).Result()
		if err != nil {
			continue
		}
		var admin models.Admin
		if err := json.Unmarshal([]byte(val), &admin); err != nil {
			continue
		}
		for _, url := range admin.VerifiedURLs {
			UniqueScamUrls[url] = true
		}
	}
	var scams []string
	for url := range UniqueScamUrls {
		scams = append(scams, url)
	}
	c.JSON(http.StatusOK, gin.H{"verified_scams": scams})
}
