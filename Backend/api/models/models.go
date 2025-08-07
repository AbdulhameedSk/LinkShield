package models

import "time"

type Request struct {
	URL         string        `json:"url"`
	CustomShort string        `json:"short"`
	Expiry      time.Duration `json:"expiry"`
}

type Responce struct {
	URL             string        `json:"url"`
	CustomShort     string        `json:"short"`
	Expiry          time.Duration `json:"expiry"`
	XRateRemaining  int           `json:"rate_limit"`
	XRateLimitReset time.Duration `json:"rate_limit_reset"`
}

type Scam struct {
	URL         string `json:"url"`
	Description string `json:"description"`
	Rating      int    `json:"rating"` // Number of people who have reported it as a scam
}

type Admin struct {
	Name         string   `json:"name" binding:"required"`
	Email        string   `json:"email" binding:"required"`
	VerifiedURLs []string `json:"verified_urls"`
}

type User struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}
