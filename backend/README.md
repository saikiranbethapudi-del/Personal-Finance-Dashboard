# Personal Finance Dashboard - Backend REST API

Production-ready, secure REST API for the Personal Finance Dashboard built with Node.js, Express.js, MongoDB, and Mongoose.

## Features

- **Authentication & Authorization**: JWT token-based auth with secure password hashing (`bcryptjs`)
- **User Management**: Profile updates and password change
- **Transactions API**: Full CRUD with search, category/type/date filtering, pagination, and sorting
- **Budgets API**: Monthly category budget tracking with automatic spending calculation and warning thresholds
- **Dashboard API**: Real-time aggregated financial summary (total balance, income, expenses, savings, monthly stats)
- **Analytics API**: Monthly trends, income vs. expense comparisons, category breakdowns using MongoDB aggregation pipelines
- **Security**: Helmet headers, CORS protection, express-validator sanitization & validation, centralized error handling

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://localhost:27017` or MongoDB Atlas URI)

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
HOST=0.0.0.0
MONGO_URI=mongodb://127.0.0.1:27017/personal_finance
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Installation
```bash
cd backend
npm install
```

### 4. Running the Server
Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user (`name`, `email`, `password`, `currency?`)
- `POST /api/auth/login` - Authenticate user & receive JWT (`email`, `password`)
- `GET /api/auth/me` - Get current authenticated user (Protected)

### User Profile
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile name and currency (Protected)
- `PUT /api/users/password` - Change password (`currentPassword`, `newPassword`) (Protected)

### Transactions
- `GET /api/transactions` - List transactions with pagination & filters (`page`, `limit`, `type`, `category`, `search`, `startDate`, `endDate`, `sortBy`, `sortOrder`) (Protected)
- `POST /api/transactions` - Create transaction (`title`, `amount`, `type`, `category`, `date`, `paymentMethod`, `description`) (Protected)
- `PUT /api/transactions/:id` - Update transaction (Protected)
- `DELETE /api/transactions/:id` - Delete transaction (Protected)

### Budgets
- `GET /api/budgets` - List budgets for month/year with spent and percentage calculations (Protected)
- `POST /api/budgets` - Create budget (`category`, `amount`, `month`, `year`) (Protected)
- `PUT /api/budgets/:id` - Update budget (Protected)
- `DELETE /api/budgets/:id` - Delete budget (Protected)

### Dashboard
- `GET /api/dashboard/summary` - Aggregated stats, monthly summary, recent transactions, category breakdown (Protected)

### Analytics
- `GET /api/analytics` - Spending trends, category breakdown, income vs. expense for selected month and year (Protected)
