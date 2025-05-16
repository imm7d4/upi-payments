# 💸 UPI Payments System (Full Stack)

This is a full-stack simulation of a UPI (Unified Payments Interface) system — including user registration, secure UPI PIN handling, sending money, transaction history, and audit logs.

---

## 📦 Tech Stack

### 🚀 Frontend
- **Framework:** React + Vite
- **Styling:** Custom CSS (no Tailwind)
- **Routing:** React Router DOM
- **State:** React Hooks, Context API
- **HTTP:** Axios (with JWT interceptors)
- **Extras:** Framer Motion (animations)

### 🔧 Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Security:** Bcrypt (for PIN hashing), Helmet
- **Logging:** Audit trails for key actions

---

## 🔐 Core Features

### ✅ Authentication & Security
- User registration & login with JWT
- UPI PIN setup and verification (hashed)
- VPA (Virtual Payment Address) management

### 💸 Send Money
- Transfer money between VPAs
- UPI PIN validation required before every transfer
- Generates transaction reference IDs like `UPI202505160001`
- Maintains sender & receiver transaction records

### 📊 Transactions & Filters
- View transaction history with:
  - Date range filters
  - Sent / Received filter
  - Amount threshold filter
  - Search by VPA
- Displays cashback earned per transaction
- Shows transaction reference ID
- (Coming soon) Export to CSV

### 💡 Smart Suggestions
- Recent VPAs shown for quick resend
- Favorite VPAs (coming soon)

### 🧾 Audit Logging
- Admin-style route to view all system-level audit logs (by VPA)

---

## 📁 Folder Structure Overview

```
project-root/
├── backend/
│   ├── routes/                # API endpoint definitions
│   │   ├── auth.js            # Authentication routes
│   │   ├── user.js            # User management routes
│   │   ├── transaction.js     # Transaction management routes
│   │   └── audit.js           # Audit logging routes
│   ├── models/                # Database models
│   │   ├── User.js            # User schema and model
│   │   └── Transaction.js     # Transaction schema and model
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── pinValidator.js    # PIN validation middleware
│   └── index.js               # Express entry point
├── frontend/
│   ├── components/            # React components
│   │   ├── SendMoneyForm      # Money transfer form component
│   │   └── Transactions       # Transaction history component
│   ├── context/               # React context providers
│   │   └── AuthContext.jsx    # Authentication context
│   ├── utils/                 # Utility functions
│   │   └── api.js             # Axios instance and API helpers
│   └── main.jsx               # Vite entry point
```
## 🔧 Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/imm7d4/upi-payments.git
cd upi-payments-system
```

### 2. Setup the Backend

```bash
cd backend
npm install
```
Create a .env file in backend/:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/upi_payments
JWT_SECRET=your_super_secret_key
```
Start the backend server:

```bash
npm run dev
```
Server runs on http://localhost:5000

### 3. Setup the Frontend

```bash
cd frontend
npm install
```

Create a .env file in frontend/:
```bash
VITE_API_URL=http://localhost:5000
```
Start the frontend:

```bash
npm run dev
```
Frontend runs on http://localhost:5173

## 🔐 API Endpoints Summary

| Endpoint                   | Method | Description                      | Auth Required |
| -------------------------- | ------ | -------------------------------- | ------------- |
| `/api/auth/login`          | POST   | Login user and return JWT token  | ❌             |
| `/api/user/register`       | POST   | Register a new user              | ❌             |
| `/api/user/pin`            | POST   | Set or update UPI PIN            | ✅             |
| `/api/user/vpa`            | POST   | Set or update VPA                | ✅             |
| `/api/user/favorites`      | POST   | Add/remove favorite VPA          | ✅             |
| `/api/user/favorites`      | GET    | Get favorite VPAs                | ✅             |
| `/api/user/list`           | GET    | List all users with VPAs         | ✅             |
| `/api/transaction/send`    | POST   | Send money to another VPA        | ✅             |
| `/api/transaction/history` | GET    | Transaction history with filters | ✅             |
| `/api/audit/logs`          | GET    | Audit logs by VPA                | ✅ (Admin)     |


## ✅ Current Functionalities
🔐 User Authentication (JWT)
🔑 PIN Setup & Secure Validation (Bcrypt)
🧾 Send Money with PIN Check
🧮 Auto-generated Transaction Reference IDs
📜 View Transaction History
🔍 Filter Transactions (date, amount, type)
🧠 View Recent Sent VPAs
⭐ Mark & View Favorite VPAs
📝 Basic Audit Logging by VPA
📤 Export Transactions to CSV


## 🚧 Roadmap / Planned Features

📅 Pagination in Transaction List
🔔 Real-time Notifications
🧑‍💼 Admin Panel for User & Audit Overview
📱 Full Mobile Responsiveness
💬 Chat-like Payment Notes
🔄 Reversal/Dispute Flow (Simulated)

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo and submit pull requests for:

Features
Bug fixes
UI/UX improvements
Code cleanup


## 📌 Disclaimer
This UPI system is built as a simulation for learning purposes only. It does not connect to any real payment gateway or financial network.

## 🙌 Acknowledgments
Inspired by UPI apps like BHIM, GPay, PhonePe — and built to understand real-world system design, frontend-backend integration, and full-stack development.
