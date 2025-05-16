
# 💸 Backend-UPI: A Simplified UPI Payment System (Node.js + MongoDB)

This is the backend service for a simplified UPI (Unified Payments Interface) system. It provides APIs for user management, secure PIN-based money transfers, transaction history, audit logging, and VPA-based contact favorites.

---

## 🚀 Features

- User registration with VPA (Virtual Payment Address)  
- PIN setup and secure login using JWT  
- Send and receive money using VPA and PIN  
- Transaction history with filters and search  
- Audit logs for key actions  
- Favorites list for frequently used VPAs  
- Auth-protected routes and error handling  

---

## 🗂️ Project Structure

```
BACKEND-UPI/
│
├── middleware/
│   └── auth.js               # JWT auth middleware
│
├── models/
│   ├── AuditLog.js           # MongoDB schema for audit logs
│   ├── Transactions.js       # MongoDB schema for transactions
│   └── User.js               # MongoDB schema for users
│
├── routes/
│   ├── audit.js              # Routes to fetch audit logs
│   ├── auth.js               # Login route
│   ├── transaction.js        # Send money, transaction history
│   └── user.js               # Register, PIN, favorites, VPA updates
│
├── utils/
│   └── logger.js             # Logs user actions to AuditLog
│
├── .env                      # Environment variables (JWT secret, DB URI, etc.)
├── app.js                    # Express app setup
├── server.js                 # Entry point
├── package.json
└── package-lock.json
```

---

## 📦 Installation & Setup

```bash
git clone https://github.com/imm7d4/upi-backend.git
cd upi-backend
npm install
```

---

## 🔧 Configure `.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/upi
JWT_SECRET=your_jwt_secret
```

---

## ▶️ Run the Server

```bash
npm start
```

---

## 🧩 API Endpoints

### ✅ Auth (`/auth`)

| Method | Endpoint | Description       |
|--------|----------|-------------------|
| POST   | /login   | Login with VPA & PIN |

**Request:**

```json
{ "vpa": "user@upi", "pin": "1234" }
```

**Response:**

```json
{ "token": "jwt_token", "vpa": "user@upi", "name": "User Name" }
```

---

### 👤 User (`/user`)

| Method  | Endpoint           | Description                 | Auth Required |
|---------|--------------------|-----------------------------|---------------|
| POST    | /register          | Register with name & VPA    | ❌            |
| POST    | /set-pin           | Set UPI PIN                 | ❌            |
| PATCH   | /update-pin        | Update UPI PIN              | ✅            |
| PATCH   | /update-vpa        | Change your VPA             | ✅            |
| GET     | /balance           | Get balance of logged-in user | ✅          |
| GET     | /                  | List all users              | ✅            |
| GET     | /favorites         | Get favorite VPAs           | ✅            |
| POST    | /favorites         | Add VPA to favorites        | ✅            |
| DELETE  | /favorites/:vpa    | Remove VPA from favorites   | ✅            |

---

### 💸 Transactions (`/transaction`)

| Method | Endpoint          | Description                      | Auth Required |
|--------|-------------------|---------------------------------|---------------|
| POST   | /send             | Send money from one VPA to another | ✅           |
| GET    | /history/:vpa     | Get full transaction history for a VPA | ✅       |
| GET    | /history          | Get logged-in user’s history (with filters) | ✅    |

**Transaction Filters (Query Params):**

- `type=sent | received | all`  
- `search=vpa` substring (regex search)  

---

### 🕵️ Audit Logs (`/audit`)

| Method | Endpoint   | Description             | Auth Required |
|--------|------------|-------------------------|---------------|
| GET    | /:vpa      | Get audit logs for a VPA | ✅            |

---

## 🔐 Security

- Passwords/PINs are hashed using bcrypt  
- Routes are protected with JWT-based auth middleware  
- Important actions (e.g., PIN updates, money sent) are recorded via the AuditLog model  

---

## 🛠️ Tech Stack

- Backend: Node.js, Express.js  
- Database: MongoDB + Mongoose  
- Authentication: JWT  
- Security: bcrypt  
- Logging: Custom Audit Logger  

---

## 📋 Sample `.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/upi
JWT_SECRET=supersecretkey
```

---

## 📌 Notes

This is a simplified version for educational or demonstration purposes.

Real-world systems would include:

- OTP verification  
- Rate limiting  
- PIN retry lockouts  
- Transaction failure rollbacks  
- UPI gateway integration  

---

## 📄 License

MIT License
