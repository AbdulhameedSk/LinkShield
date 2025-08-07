# 🚀 URL Shortener - Full Stack Application

A complete URL shortening service with a **Go backend** and **React frontend**. Features include URL shortening, scam reporting, admin management, and a modern responsive UI.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Frontend Features](#-frontend-features)
- [Backend Features](#-backend-features)
- [Docker Setup](#-docker-setup)
- [Development](#-development)
- [Deployment](#-deployment)

## ✨ Features

### 🔗 Core URL Shortening
- **URL Shortening**: Create short URLs with custom codes
- **Custom Expiry**: Set expiration times (1 hour to 1 week)
- **Rate Limiting**: API quota management per IP
- **URL Validation**: Automatic URL validation and formatting

### 🛡️ Security & Management
- **User Authentication**: JWT-based login/signup system
- **Scam Reporting**: Report and vote on suspicious URLs
- **Admin Verification**: Admin-only scam verification
- **URL Management**: Edit, delete, and tag URLs

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Real-time Feedback**: Success/error messages
- **Loading States**: Visual feedback during operations
- **Copy to Clipboard**: One-click URL copying

## 🛠️ Tech Stack

### Backend
- **Go** with Gin framework
- **Redis** for data storage
- **JWT** for authentication
- **Docker** for containerization

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Heroicons** for icons

## 📁 Project Structure

```
URL-Shortener/
├── URL-Shortner-BE/           # Go Backend
│   ├── api/
│   │   ├── database/         # Redis connection
│   │   ├── middleware/       # JWT middleware
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   ├── db/                  # Docker configuration
│   ├── main.go             # Entry point
│   └── docker-compose.yml  # Docker setup
├── url-shortener-frontend/   # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── App.tsx         # Main app
│   └── package.json
└── package.json            # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- **Go** (v1.19+)
- **Node.js** (v14+)
- **Docker** (optional)
- **Redis** (via Docker or local)

### Option 1: Using Docker (Recommended)

1. **Clone the repository**:
```bash
git clone <repository-url>
cd URL-Shortener
```

2. **Start with Docker**:
```bash
# Start backend with Redis
npm run docker-up

# In another terminal, start frontend
npm run start-frontend
```

3. **Access the application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Option 2: Local Development

1. **Install dependencies**:
```bash
npm run install-all
```

2. **Start Redis** (if not using Docker):
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install Redis locally
```

3. **Start the application**:
```bash
# Start both frontend and backend
npm run dev

# Or start separately:
npm run start-backend    # Backend on :8080
npm run start-frontend   # Frontend on :3000
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | User registration |
| POST | `/login` | User login |

### URL Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1` | Create shortened URL |
| GET | `/api/v1/:shortID` | Get original URL |
| PUT | `/api/v1/:shortID` | Edit URL (protected) |
| DELETE | `/api/v1/:shortID` | Delete URL (protected) |
| POST | `/api/v1/addTag` | Add tags to URL (protected) |

### Scam Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/getVerifiedScams` | Get verified scams |
| GET | `/api/v1/GetScams` | Get reported scams |
| POST | `/api/v1/AddScams` | Report a scam (protected) |
| POST | `/api/v1/vote` | Vote on scam (protected) |
| POST | `/api/v1/addAdmin` | Add admin (protected) |
| POST | `/api/v1/verifyScamByAdmin` | Verify scam (protected) |

## 🎨 Frontend Features

### Dashboard
- **URL Shortening Interface**: Clean form with validation
- **Custom Short Codes**: Optional custom URL codes
- **Expiry Selection**: Choose from 1 hour to 1 week
- **Rate Limit Display**: Real-time API quota information
- **Copy Functionality**: One-click URL copying

### URL Management
- **Edit URLs**: Modify destination and expiry
- **Delete URLs**: Remove with confirmation
- **Tag Management**: Add organizational tags

### Scam Management
- **Report Interface**: Easy scam reporting form
- **Voting System**: Support reports by voting
- **Admin Verification**: Verify scams as admin
- **Tabbed Views**: Separate reported/verified lists

### Admin Features
- **Admin Registration**: Add new admin users
- **Permission Management**: Clear admin capabilities

## ⚙️ Backend Features

### Database Design
- **Redis DB 0**: URL mappings (short → original)
- **Redis DB 1**: Rate limiting per IP
- **Redis DB 2**: Scam reports
- **Redis DB 3**: Admin information
- **Redis DB 4**: User accounts

### Security Features
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Per-IP API quota management
- **Input Validation**: URL and data validation
- **CORS Support**: Cross-origin request handling

### Performance Features
- **Redis Caching**: Fast data access
- **Connection Pooling**: Efficient database connections
- **Error Handling**: Comprehensive error management

## 🐳 Docker Setup

### Backend with Redis
```yaml
# docker-compose.yml
version: '3.8'
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - redis
    environment:
      - DB_ADDR=redis:6379
```

### Running with Docker
```bash
# Build and start
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## 🔧 Development

### Backend Development
```bash
cd URL-Shortner-BE

# Run with hot reload
go run main.go

# Build binary
go build -o url-shortener

# Run tests
go test ./...
```

### Frontend Development
```bash
cd url-shortener-frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Environment Variables
Create `.env` file in backend directory:
```env
APP_PORT=8080
DB_ADDR=localhost:6379
DB_PASS=
API_QUOTA=10
Domain=http://localhost:8080
JWT_SECRET=your-secret-key
```

## 🚀 Deployment

### Backend Deployment
1. **Build Docker image**:
```bash
cd URL-Shortner-BE
docker build -t url-shortener-backend .
```

2. **Deploy with Docker Compose**:
```bash
docker-compose up -d
```

### Frontend Deployment
1. **Build production version**:
```bash
cd url-shortener-frontend
npm run build
```

2. **Serve static files**:
```bash
# Using nginx
sudo cp -r build/* /var/www/html/

# Using serve
npx serve -s build -l 3000
```

## 📊 Monitoring & Logs

### Backend Logs
```bash
# View application logs
docker-compose logs -f app

# View Redis logs
docker-compose logs -f redis
```

### Frontend Logs
- Check browser console for client-side errors
- Monitor network requests in browser dev tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Open an issue in the repository
- **Documentation**: Check the README files in each directory
- **Backend Issues**: Check `URL-Shortner-BE/README.md`
- **Frontend Issues**: Check `url-shortener-frontend/README.md`

##  Acknowledgments

- **Gin Framework** for the web framework
- **Redis** for data storage
- **React** for the frontend framework
- **Tailwind CSS** for styling
- **Heroicons** for beautiful icons

---

**Made with ❤️ by Shaik Abdulhameed** 