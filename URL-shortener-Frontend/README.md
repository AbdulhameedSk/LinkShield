# URL Shortener Frontend

A modern, responsive React frontend for the URL Shortener backend service. Built with TypeScript, Tailwind CSS, and React Router.

## Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Protected routes
- Automatic token management

### 🔗 URL Management
- **URL Shortening**: Create short URLs with custom codes and expiry times
- **URL Editing**: Modify existing shortened URLs
- **URL Deletion**: Remove URLs from the system
- **Tag Management**: Add tags to URLs for better organization
- **Copy to Clipboard**: One-click copying of shortened URLs

### 🛡️ Scam Management
- **Report Scams**: Report suspicious URLs with descriptions
- **Vote on Reports**: Support scam reports by voting
- **Admin Verification**: Admins can verify reported scams
- **View Verified Scams**: Browse admin-verified scam URLs

### 👥 Admin Features
- **Add Admins**: Register new admin users
- **Admin Permissions**: Manage admin access and capabilities

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface with Tailwind CSS
- **Sidebar Navigation**: Easy access to all features
- **Real-time Feedback**: Success/error messages for all actions
- **Loading States**: Visual feedback during API calls
- **Mobile Responsive**: Works on all device sizes

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Heroicons** for icons
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/           # React components
│   ├── Login.tsx        # Login form
│   ├── Signup.tsx       # Registration form
│   ├── Dashboard.tsx    # Main URL shortening interface
│   ├── UrlManagement.tsx # URL editing/deletion/tagging
│   ├── ScamManagement.tsx # Scam reporting and management
│   └── AdminManagement.tsx # Admin user management
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── services/            # API services
│   └── api.ts          # Axios configuration and API calls
├── App.tsx             # Main app component with routing
└── index.tsx           # App entry point
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login

### URL Management
- `POST /api/v1` - Create shortened URL
- `GET /api/v1/:shortID` - Get original URL
- `PUT /api/v1/:shortID` - Edit URL
- `DELETE /api/v1/:shortID` - Delete URL
- `POST /api/v1/addTag` - Add tags to URL

### Scam Management
- `GET /api/v1/getVerifiedScams` - Get verified scams
- `GET /api/v1/GetScams` - Get reported scams
- `POST /api/v1/AddScams` - Report a scam
- `POST /api/v1/vote` - Vote on scam report
- `POST /api/v1/addAdmin` - Add admin user
- `POST /api/v1/verifyScamByAdmin` - Verify scam as admin

## Environment Configuration

The frontend is configured to connect to the backend at `http://localhost:8080`. To change this:

1. Edit `src/services/api.ts`
2. Update the `API_BASE_URL` constant

## Features in Detail

### Dashboard
- Clean interface for URL shortening
- Support for custom short codes
- Configurable expiry times (1 hour to 1 week)
- Real-time rate limit display
- Copy-to-clipboard functionality

### URL Management
- **Edit URLs**: Change destination URL and expiry time
- **Delete URLs**: Remove URLs with confirmation
- **Add Tags**: Tag URLs for better organization

### Scam Management
- **Report Interface**: Easy form to report suspicious URLs
- **Voting System**: Support reports by voting
- **Admin Verification**: Admins can verify scams
- **Tabbed Interface**: Separate views for reported and verified scams

### Admin Management
- **Add Admins**: Simple form to register new admin users
- **Permission Overview**: Clear display of admin capabilities

## Security Features

- JWT token authentication
- Automatic token refresh
- Protected routes
- Secure API communication
- Input validation and sanitization

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## Error Handling

- Comprehensive error messages
- Network error handling
- Form validation
- Loading states
- User-friendly error display

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
