package shorten

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/gin-gonic/gin"
)

type TagRequest struct {
	ShortID string `json:"shortid"`
	Tag     string `json:"tag"`
}

func AddTag(c *gin.Context) {
	var tagRequest TagRequest
	if err := c.ShouldBindJSON(&tagRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}
	// Add the tag to the database
	shortId := tagRequest.ShortID
	tag := tagRequest.Tag
	r := database.CreateClient(0)
	defer r.Close()
	val, err := r.Get(database.Ctx, shortId).Result()
	if err != nil {
		fmt.Println("🔴 Redis error:", err)
		fmt.Println("🔎 shortId received:", shortId)
		c.JSON(http.StatusNotFound, gin.H{"error": "Short ID not found"})
		return
	}
	var data map[string]interface{}
	if err := json.Unmarshal([]byte(val), &data); err != nil {
		//If data is not valid JSON we assume it is a string
		data = make(map[string]interface{})
		data["data"] = val
	}
	//check if tags already exist and if its slice of strings
	var tags []string
	if existingTags, ok := data["tags"].([]interface{}); ok {
		for _, t := range existingTags {
			if tagStr, ok := t.(string); ok {
				tags = append(tags, tagStr)
			}
		}
	}
	//check for duplicate tag
	for _, existingTag := range tags {
		if existingTag == tag {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Tag already exists"})
			return
		}
	}
	//Add the new tag
	tags = append(tags, tag)
	data["tags"] = tags
	// Save the updated data back to the database
	updatedData, err := json.Marshal(data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tags"})
		return
	}
	// Save the updated data back to the database
	if err := r.Set(database.Ctx, shortId, updatedData, 0).Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tags"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Tag added successfully"})
}
