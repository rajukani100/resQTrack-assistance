<div align="center">

<img src="https://img.shields.io/badge/Flutter-3.x-02569B?style=for-the-badge&logo=flutter&logoColor=white" />
<img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />

<br/><br/>

# 🚨 ResQTrack

### Roadside Assistance & Emergency Support

*Connecting drivers in distress with nearby service providers - instantly.*

[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Docs](#-api-endpoints) · [Screenshots](#-screenshots) · [Contributing](#-contributing)

---

</div>

## 📖 Overview

**ResQTrack** is a comprehensive, real-time roadside assistance platform built for the modern road emergency. When a driver breaks down, runs out of fuel, or has a flat tire, ResQTrack connects them with the nearest available service provider in minutes - not hours.

The platform consists of **four integrated components** working in unison:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| 📱 **Mobile App** | Flutter / Dart | Driver interface for requesting assistance |
| 🌐 **Bystander Portal** | React / JS | Public web interface for reporting accidents |
| 🔧 **Service Provider Portal** | React / JS | Provider dashboard for managing requests & billing |
| ⚙️ **Backend API** | Node.js / Express | RESTful API powering all components |

---

## ✨ Features

### 📱 Mobile App (Driver)
- **OTP-based Authentication** - Secure phone number verification
- **Service Requests** - Towing · Flat Tire · Fuel Delivery · Jump Start · Mechanical Repair
- **Real-time GPS Tracking** - Live map showing your assigned provider approaching
- **ResQTag System** - QR code emergency identification card
- **Community Chat** - Share road conditions with nearby users
- **Wallet & Credits** - In-app credit system for seamless payments
- **Service History** - Full history of past requests
- **Rating System** - Rate and review service providers

### 🌐 Bystander Portal
- **Accident Reporting** - Report accidents with location in seconds
- **Tow Vehicle Alerts** - Flag abandoned or breakdown vehicles
- **Emergency Notifications** - Alert nearby users and service providers instantly

### 🔧 Service Provider Portal
- **Request Dashboard** - Real-time incoming requests with customer map location
- **Accept / Reject Jobs** - One-click job management with instant backend sync
- **Availability Toggle** - Go online/offline with a single switch
- **Customer Details** - View vehicle info, location, and contact details
- **Billing & Invoices** - Generate and manage service invoices
- **Service History** - Track all completed jobs
- **Rating Management** - View and respond to customer feedback

### ⚙️ Backend
- **RESTful API** - Comprehensive endpoints for all platform operations
- **JWT Authentication** - Role-based access for users, providers, and admins
- **PDF Invoice Generation** - Automated invoices via PDFKit
- **Image Uploads** - Cloudinary integration for SOS photos and profiles
- **Optional Telegram Bot** - Supplementary notification channel for providers
- **SMS Notifications** - Twilio integration for critical alerts

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│  ┌──────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ Mobile   │  │  Bystander     │  │ Service Provider│  │
│  │  App     │  │    Portal      │  │    Portal       │  │
│  │(Flutter) │  │   (React)      │  │    (React)      │  │
│  └────┬─────┘  └──────┬─────────┘  └────────┬────────┘  │
└───────┼───────────────┼────────────────────-─┼───────────┘
        │               │   REST API calls      │
┌───────┼───────────────┼──────────────────────┼───────────┐
│       ▼               ▼   BACKEND LAYER       ▼           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │          Node.js / Express REST API Server           │ │
│  │     JWT Auth · Helmet · CORS · Rate Limiting         │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────-─┘
                          │
┌─────────────────────────┼──────────────────────────────────┐
│                         ▼    DATA & SERVICES LAYER          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐  ┌───────┐  │
│  │ MongoDB  │  │  Cloudinary  │  │ Google    │  │Vercel │  │
│  │  Atlas   │  │     CDN      │  │ Maps API  │  │(Host) │  │
│  └──────────┘  └──────────────┘  └───────────┘  └───────┘  │
└────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Request:    Mobile App → API → MongoDB → Provider Portal → Provider
Bystander Alert: Web Portal → API → MongoDB → Provider Portal + Mobile Alerts
Provider Accept: Provider Portal → API → MongoDB → Mobile App notification
Emergency SOS:   Mobile SOS → API → Provider Portal → Emergency Response
```

---

## 🛠 Tech Stack

### Frontend
| Layer | Technologies |
|-------|-------------|
| Mobile | Flutter 3.x, Dart, GetX, Flutter Map, Geolocator, QR Flutter |
| Bystander Portal | React 18, TailwindCSS, React Router, Lucide React, Vite |
| Provider Portal | React 18, TailwindCSS, React Router, Lucide React, Vite |

### Backend
| Layer | Technologies |
|-------|-------------|
| Server | Node.js 18 LTS, Express.js 4.x |
| Database | MongoDB 6.x with Mongoose ORM |
| Auth | JSON Web Tokens (JWT), bcrypt |
| File Uploads | Multer, Cloudinary |
| PDF | PDFKit |
| Security | Helmet.js, CORS, input validation |

### Third-Party Services
| Service | Purpose |
|---------|---------|
| **Cloudinary** | Image storage & CDN delivery |
| **Twilio** | SMS notifications |
| **Google Maps API** | Geocoding, routing, live maps |
| **Telegram Bot API** | Optional supplementary provider notifications |
| **Vercel** | Hosting for both React web portals |
| **MongoDB Atlas** | Cloud-hosted database |

---

## 📁 Repository Structure

```
resqtrack/
├── mobile/                  # Flutter mobile application
│   ├── lib/
│   │   ├── controllers/     # GetX controllers
│   │   ├── models/          # Data models
│   │   ├── screens/         # UI screens
│   │   ├── services/        # API service layer
│   │   └── widgets/         # Reusable widgets
│   └── pubspec.yaml
│
├── web-bystander/           # React bystander portal
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── web-provider/            # React service provider portal
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── backend/                 # Node.js API server
    ├── controllers/
    ├── middleware/
    ├── models/
    │   ├── User.js
    │   ├── ServiceProvider.js
    │   └── ServiceRequest.js
    ├── routes/
    ├── utils/
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Flutter SDK 3.x
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google Maps API key
- Twilio account (optional)
- Telegram Bot Token (optional)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/resqtrack.git
cd resqtrack
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resqtrack
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio (optional)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Telegram (optional)
TELEGRAM_BOT_TOKEN=your_bot_token

# Google Maps
GOOGLE_MAPS_API_KEY=your_api_key
```

Start the backend server:

```bash
npm run dev       # Development (nodemon)
npm start         # Production
```

The API will be available at `http://localhost:5000`.

### 3. Bystander Portal Setup

```bash
cd web-bystander
npm install
```

Create a `.env` file in `/web-bystander`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_api_key
```

```bash
npm run dev       # Development server
npm run build     # Production build
```

### 4. Service Provider Portal Setup

```bash
cd web-provider
npm install
```

Create a `.env` file in `/web-provider`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_api_key
```

```bash
npm run dev       # Development server
npm run build     # Production build
```

### 5. Mobile App Setup

```bash
cd mobile
flutter pub get
```

Update `lib/services/api_service.dart` with your backend URL:

```dart
const String baseUrl = 'http://localhost:5000'; // or your deployed URL
```

Run on a connected device or emulator:

```bash
flutter run
```

---

## 📡 API Endpoints

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/register` | Register new user |
| `POST` | `/api/user/login` | User login (returns JWT) |
| `GET` | `/api/user/profile` | Get user profile |
| `PUT` | `/api/user/profile` | Update user profile |

### Service Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/request` | Create service request |
| `GET` | `/api/user/requests` | Get user's request history |
| `PUT` | `/api/user/request/:id` | Update request status |
| `POST` | `/createsosrequest` | Create SOS request with image |

### Service Provider
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/provider/register` | Provider registration |
| `POST` | `/api/provider/login` | Provider login |
| `GET` | `/api/provider/requests` | Get available requests |
| `PUT` | `/api/provider/request/:id/accept` | Accept a request |
| `PUT` | `/api/provider/request/:id/reject` | Reject a request |
| `GET` | `/api/provider/history` | Get service history |
| `PUT` | `/api/provider/availability` | Update availability status |
| `GET` | `/api/provider/profile` | Get provider profile |
| `PUT` | `/api/provider/profile` | Update provider profile |

### Community & Utilities
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/community/chat` | Send community message |
| `GET` | `/api/community/chats` | Get community messages |
| `GET` | `/generate-invoice` | Generate service invoice PDF |

> All protected routes require `Authorization: Bearer <token>` header.

---

## 🗄 Database Schema

<details>
<summary><b>User Model</b></summary>

```javascript
{
  name, email, phone, password,
  location: { latitude, longitude },
  vehicleDetails: { make, model, year, licensePlate },
  emergencyContacts: [{ name, phone }],
  resQTagCardNo,
  credits,
  serviceRequests: [{ serviceType, requestTime, status }],
  communityChats:  [{ message, sender, timestamp }],
  role: ["user", "serviceprovider"]
}
```
</details>

<details>
<summary><b>Service Provider Model</b></summary>

```javascript
{
  name, email, phone, password,
  location: { latitude, longitude },
  chatId,                          // Telegram integration (optional)
  servicesOffered: [
    "Towing", "Flat Tire", "Fuel Delivery", "Jump Start", "Mechanical Repair"
  ],
  availabilityStatus: ["available", "busy", "offline"],
  rating: { totalReviews, averageRating },
  serviceHistory: [{ serviceRequestId, completedAt }]
}
```
</details>

<details>
<summary><b>Service Request Model</b></summary>

```javascript
{
  userId, serviceType,
  location: { latitude, longitude },
  status:        ["pending", "in_progress", "completed", "cancelled"],
  requestStatus: ["pending", "accept", "reject"],
  assignedMechanic, requestId,
  additionalInfo, vehicleType,
  estimatedArrivalTime, createdAt, updatedAt
}
```
</details>

---

## 🔐 Security

- **JWT** - Stateless authentication with role-based access control
- **bcrypt** - Password hashing with salt rounds
- **Helmet.js** - HTTP security headers
- **CORS** - Configured origin whitelist
- **Input Validation** - Sanitization on all endpoints
- **HTTPS** - Enforced in production deployments

---

## 🚢 Deployment

| Component | Platform |
|-----------|---------|
| Mobile App | Google Play Store / Apple App Store |
| Bystander Portal | Vercel |
| Provider Portal | Vercel |
| Backend API | Render / Railway / AWS EC2 |
| Database | MongoDB Atlas |

### Deploy backend to Render

1. Push to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all environment variables from `.env`

### Deploy portals to Vercel

```bash
# From web-bystander/ or web-provider/
npx vercel --prod
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure your code follows the existing style and all tests pass before submitting.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

---

<div align="center">

Made with ❤️ for safer roads

⭐ Star this repo if you found it helpful!

</div>
