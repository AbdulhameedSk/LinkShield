package shorten

import (
	"net/http"
	"time"

	"github.com/abdulhameedsk/URL-Shortner/api/database"
	"github.com/abdulhameedsk/URL-Shortner/api/models"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

func EditURL(c *gin.Context) {
	shortID := c.Param("shortID")
	var body models.Request

	if err := c.ShouldBind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "cannot parse JSON",
		})
		return
	}

	r := database.CreateClient(0)
	defer r.Close()

	_, err := r.Get(database.Ctx, shortID).Result()
	if err != nil {
		if err == redis.Nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "ShortID does not exist",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Redis error",
			})
		}
		return
	}

	err = r.Set(database.Ctx, shortID, body.URL, body.Expiry*3600*time.Second).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "unable to update shortened link",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "The ShortID updated",
	})
}
