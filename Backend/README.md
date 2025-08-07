

```markdown
# 🚀 URL Shortener – Go + Gin + Redis + Docker

A lightweight and powerful URL shortening service built with **Golang**, **Gin Web Framework**, **Redis**, and **Docker**. It exposes RESTful APIs to shorten, retrieve, tag, edit, delete URLs, and manage scam reports and admin verification — ideal for modern web applications.

---

## 📁 Project Structure


`
url-shortener/
├── api/
│   ├── database/          # Redis connection and helper functions
│   ├── utils/             # Utility functions (e.g., short ID generator)
│   └── router/            # API route handlers
│       ├── get.go         # Get original URL by short ID
│       ├── shorten.go     # Create a shortened URL
│       ├── editurl.go     # Edit an existing short URL
│       ├── tag.go         # Tag a URL
│       ├── deleteurl.go   # Delete a URL
│       ├── scam.go        # Add/Get scams
│       ├── vote.go        # Upvote a reported scam
│       ├── admin.go       # Add an admin
│       └── verified.go    # Get verified scams
│
├── DB/
│   ├── redis.Dockerfile       # Redis container configuration
│   ├── app.Dockerfile         # Go application Dockerfile
│   └── docker-compose.yml     # Compose file for Redis + App setup
│
├── main.go                # Entry point of the application
└── README.md              # Project documentation

````

---

## ✨ Features

- 🔗 **Shorten URLs** – Create unique short links from long URLs.
- 🧭 **Retrieve URLs** – Resolve short links to original URLs.
- ✏️ **Edit URLs** – Modify existing shortened URL entries.
- 🏷️ **Tag URLs** – Attach tags to your links for easy categorization.
- 🗑️ **Delete URLs** – Remove short URLs from the system.
- 🧾 **Report Scams** – Users can report scam URLs.
- 👍 **Vote on Scams** – Increase the scam count.
- ✅ **Admin Verification** – Admins can verify scam URLs.
- 🔐 **Get Verified Scams** – Retrieve list of admin-verified scam links.

---

## 📡 API Endpoints

| Method   | Endpoint                    | Description                                  |
|----------|-----------------------------|----------------------------------------------|
| `GET`    | `/api/v1/:shortid`          | Retrieve original URL from short ID          |
| `POST`   | `/api/v1/shorten`           | Create a new shortened URL                   |
| `PUT`    | `/api/v1/editurl`           | Edit an existing short URL                   |
| `POST`   | `/api/v1/tag`               | Add tag(s) to a shortened URL                |
| `DELETE` | `/api/v1/deleteurl/:id`     | Delete a shortened URL                       |
| `POST`   | `/api/v1/addScam`           | Report a scam URL                            |
| `GET`    | `/api/v1/getScams`          | Fetch all reported scam URLs                 |
| `POST`   | `/api/v1/vote`              | Increase scam rating for a reported URL      |
| `POST`   | `/api/v1/addAdmin`          | Register an admin                            |
| `POST`   | `/api/v1/verifyScam`        | Admin-only: mark a URL as verified scam      |
| `GET`    | `/api/v1/getVerifiedScams`  | Get list of verified scam URLs by admins     |

> All endpoints are versioned under `/api/v1/`.

---

## 🐳 Dockerized Setup

### 🔧 Prerequisites

- Docker & Docker Compose installed
- Go (optional, for local runs)

### 📦 Clone the Repository

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
````

### ▶️ Run with Docker Compose

```bash
docker-compose up --build
```

This will:

* Start Redis on `localhost:6379`
* Start the Go app on `localhost:8000`

> DO NOT REMOVE THIS NOTE:
>
> | Your Go app runs on | Dockerfile `EXPOSE` | Docker Compose port line | Access via       |
> | ------------------- | ------------------- | ------------------------ | ---------------- |
> | `:8000`             | `EXPOSE 8000`       | `ports: - "8000:8000"`   | `localhost:8000` |
> | `:8080`             | `EXPOSE 8080`       | `ports: - "8080:8080"`   | `localhost:8080` |
> | `:8080`             | `EXPOSE 8080`       | `ports: - "8000:8080"`   | `localhost:8000` |

---

## 🧠 Redis Keys Used

| Redis DB | Purpose                         | Key Used        | Value Stored                       |
| -------- | ------------------------------- | --------------- | ---------------------------------- |
| DB 0     | URL Mapping (short to original) | `url:<shortid>` | Full URL                           |
| DB 1     | Rate Limiting per client IP     | `rate:<ip>`     | Remaining API quota                |
| DB 2     | Scam Reports                    | `<url>`         | Scam JSON (description + rating)   |
| DB 3     | Admin Info                      | `admin:<email>` | Admin JSON with verified scam URLs |

✅ Alternatively, if using one DB:

* Use key prefixes like `rate:`, `url:`, `tag:`, `scam:`, `admin:` to separate concerns.

---

## 💡 Developer Notes

### Basics:

1. `go mod init github.com/yourusername/gin-demo` is used to initialize go module. If one plans to publish module in GitHub it is useful
2. `*gin.Context` is the heart of each request in Gin. You need it to read the request and send the response. That's why you always pass it into your handler functions.

---

## Passing Values vs Pointers in Go

### ❗️ By Value:

```go
func changeValue(val int) {
    val = 10
}
```

* Creates a **copy** of `val`
* Changes are **not reflected** in the original variable

### ✅ By Pointer:

```go
func changeValue(val *int) {
    *val = 10
}
```

* Works with the **original memory reference**
* Changes are **reflected globally**

---

## 🔍 Why use `*gin.Engine`?

```go
func setupRouters(router *gin.Engine)
```

* You’re passing a **pointer** to the actual Gin engine.
* Allows you to **add routes** to the original instance in `main.go`.

🧠 Think of `*gin.Engine` like editing a **shared Google Doc**, whereas `gin.Engine` alone is like editing a **printed copy**.

---

## ✅ Common *gin.Context* Usage

### 1. Query Parameters

```go
name := c.Query("name")
```

### 2. JSON Body

```go
var user User
c.BindJSON(&user)
```

### 3. Headers

```go
token := c.GetHeader("Authorization")
```

### 4. Path Parameters

```go
id := c.Param("id")
```

### 5. Sending Response

```go
c.JSON(200, gin.H{"message": "Hi"})
c.String(200, "Text")
```

---

## 🧱 Using Redis in Go

Installed with:

```bash
go get github.com/redis/go-redis/v9
```

### 🔧 Setup (`database/redis.go`)

```go
func CreateClient(dbNo int) *redis.Client {
    rdb := redis.NewClient(&redis.Options{
        Addr:     os.Getenv("DB_ADDR"),
        Password: os.Getenv("DB_PASS"),
        DB:       dbNo,
    })
    return rdb
}
```

### 🔧 Usage

```go
rdb := CreateClient(0)
rdb.Set(ctx, "key", "value", 0)
val, _ := rdb.Get(ctx, "key").Result()
```

---

## 🔄 Using Single Redis DB with Prefixes (Recommended)

| Prefix   | Use Case       | Example Key      |
| -------- | -------------- | ---------------- |
| `rate:`  | API rate limit | `rate:127.0.0.1` |
| `url:`   | Short URL      | `url:abc123`     |
| `tags:`  | Tags for URL   | `tags:abc123`    |
| `scam:`  | Scam info      | `scam:<url>`     |
| `admin:` | Admin info     | `admin:email`    |

Keeps everything isolated while using just one Redis DB.

---

## ✅ Full Flow of `shorten` API (explained)

1. Parse JSON input
2. Rate limit using Redis `rate:<ip>`
3. Validate URL and reject own domain
4. Generate short ID (custom or UUID)
5. Store as `url:<shortid>` in Redis
6. Decrement rate counter
7. Respond with shortened link + rate info

---

## 🧪 Test with Redis CLI

```bash
docker exec -it <redis-container> redis-cli -n 0
> GET url:abc123
"https://example.com"
> TTL rate:127.0.0.1
```

---

## 🔮 Future Enhancements

* 📊 Click analytics
* 🔐 User authentication
* 🧼 Expired link cleanup
* 📝 Custom domain support

---

## 🤝 Contributing

Pull requests, feature requests, and bug reports are welcome!

---

## 📄 License

MIT License – Use it freely and modify as needed.

---

## 🔚 Final Notes

DO NOT REMOVE THIS SECTION

| Your Go app runs on | Dockerfile `EXPOSE` | Docker Compose port line | Access via       |
| ------------------- | ------------------- | ------------------------ | ---------------- |
| `:8000`             | `EXPOSE 8000`       | `ports: - "8000:8000"`   | `localhost:8000` |
| `:8080`             | `EXPOSE 8080`       | `ports: - "8080:8080"`   | `localhost:8080` |
| `:8080`             | `EXPOSE 8080`       | `ports: - "8000:8080"`   | `localhost:8000` |

| Action                   | Function           | Use Case                         |
| ------------------------ | ------------------ | -------------------------------- |
| Convert Go struct ➝ JSON | `json.Marshal()`   | Save to Redis or respond in JSON |
| Convert JSON ➝ Go struct | `json.Unmarshal()` | Read from Redis or parse request |

---

Made with 💻 by Shaik Abdul Hameed
📧 [shaikabdulhameedd@gmail.com](mailto:shaikabdulhameedd@gmail.com)

---

🔗 [Postman Collection](https://team88-2553.postman.co/workspace/team%3F-Workspace~48e372de-5f99-4b70-8628-3bf90542fab6/collection/31832585-2ef7159f-3efc-479d-b0f8-edbeed0f47f7?action=share&creator=31832585)


