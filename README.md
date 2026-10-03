# Personal Finance Dashboard 💰📊

A modern, responsive, production-quality Personal Finance Dashboard application built with a React + Vite + Tailwind CSS frontend and a Node.js + Express + MongoDB REST API backend.

---

## 🌟 Key Features

### 🖥️ Frontend (React + Vite + Tailwind CSS)
- **Modern Fintech UI**: Clean, accessible design with subtle card shadows, responsive grids, and dark/light mode.
- **Interactive Visualizations (Recharts)**:
  - Income vs Expenses Bar Chart
  - Expense Breakdown Donut/Pie Chart
  - Monthly Spending & Savings Area Trend Chart
- **Comprehensive Financial Management**:
  - **Dashboard**: Net balance, total income/expenses, monthly budget health, remaining balance, and recent activities.
  - **Transactions**: Full CRUD with server-side pagination, search, category filters, type toggles, date ranges, and sorting.
  - **Budgets**: Set monthly category spending caps with live visual progress bars and warning states (80% warning, 100%+ exceeded).
  - **Analytics**: Deep-dive financial analysis by month and year with aggregated metrics and breakdowns.
  - **User Profile**: Update profile name, change base currency, and change password securely.
  - **Settings**: Primary currency switcher (USD, EUR, GBP, INR, CAD, AUD, JPY), theme switcher (Light/Dark), and notification preferences.
- **Authentication**: JWT token storage, automatic request header injection (`Authorization: Bearer <token>`), 401 automatic logout handling, and Protected Routes.

### ⚙️ Backend (Node.js + Express + MongoDB)
- **MVC Architecture**: Structured controllers, models, routes, and middleware.
- **Secure Authentication**: Password hashing with `bcryptjs`, JWT token signing and verification.
- **MongoDB Aggregation Pipelines**:
  - Dashboard summaries (balance, monthly cash flows, category expense totals)
  - Analytics pipelines (annual monthly trends, category percentages, savings rate)
- **Data Integrity & Security**:
  - `express-validator` input validation and sanitization
  - `helmet` security headers & configurable `cors`
  - Centralized error handling middleware
  - Unique compound indexes on budget categories per user and month

---

## 📁 Project Structure

```
Personal Finance Dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, Me
│   │   │   ├── userController.js     # Profile updates, password changes
│   │   │   ├── transactionController.js # Transaction CRUD, pagination, filtering
│   │   │   ├── budgetController.js   # Budget CRUD & spending calculations
│   │   │   ├── dashboardController.js # Aggregated dashboard summaries
│   │   │   └── analyticsController.js # Annual trends & category aggregations
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # Bearer token verification
│   │   │   └── errorMiddleware.js    # 404 & Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js               # User schema with bcrypt pre-save hook
│   │   │   ├── Transaction.js        # Transaction schema & compound indexes
│   │   │   └── Budget.js             # Budget schema & unique compound constraints
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   ├── budgetRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── utils/
│   │   │   └── generateToken.js      # JWT signing helper
│   │   ├── app.js                    # Express app configuration & middlewares
│   │   └── server.js                 # HTTP server listener & DB connection
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── src/
│   ├── api/
│   │   └── api.js                    # Axios instance, interceptors & API services
│   ├── services/
│   │   └── api.js                    # Re-export alias for API service
│   ├── charts/
│   │   ├── IncomeExpenseChart.jsx    # Recharts Bar Chart
│   │   ├── ExpenseCategoryChart.jsx  # Recharts Donut Pie Chart
│   │   └── SpendingTrendChart.jsx    # Recharts Area Chart
│   ├── components/
│   │   ├── Sidebar.jsx               # Desktop & mobile drawer navigation
│   │   ├── Header.jsx                # Search, notifications, theme & profile header
│   │   ├── DashboardCard.jsx         # Metric card with loading skeletons
│   │   ├── TransactionTable.jsx      # Desktop table & mobile card list
│   │   ├── TransactionCard.jsx       # Responsive mobile transaction item
│   │   ├── TransactionModal.jsx      # Add / Edit transaction dialog
│   │   ├── BudgetCard.jsx            # Monthly category budget item
│   │   ├── BudgetProgress.jsx        # Visual progress bar with warning states
│   │   ├── ProtectedRoute.jsx        # Route authentication guard
│   │   ├── LoadingSpinner.jsx        # Loading indicator
│   │   ├── EmptyState.jsx            # Clean empty placeholder
│   │   ├── ErrorMessage.jsx          # Error banner with retry button
│   │   ├── ConfirmDialog.jsx         # Generic deletion confirmation modal
│   │   └── Toast.jsx                 # Toast notification system
│   ├── context/
│   │   ├── AuthContext.jsx           # User state, login, register, token persistence
│   │   ├── SettingsContext.jsx       # Theme, currency, and notifications state
│   │   └── ToastContext.jsx          # Toast dispatchers
│   ├── layouts/
│   │   └── MainLayout.jsx            # Sidebar + Header + Content shell
│   ├── pages/
│   │   ├── LoginPage.jsx             # User login
│   │   ├── RegisterPage.jsx          # User registration
│   │   ├── DashboardPage.jsx         # Main financial dashboard
│   │   ├── TransactionsPage.jsx      # Transactions list, search & filters
│   │   ├── BudgetPage.jsx            # Category budget manager
│   │   ├── AnalyticsPage.jsx         # Financial trends & breakdowns
│   │   ├── ProfilePage.jsx           # User profile & credentials
│   │   ├── SettingsPage.jsx          # Preferences & theme
│   │   └── NotFoundPage.jsx          # 404 page
│   ├── utils/
│   │   ├── constants.js              # Categories, currencies & payment methods
│   │   └── formatters.js             # Currency, date, and percentage formatters
│   ├── App.jsx                       # Application router configuration
│   ├── main.jsx                      # React 19 entry point
│   └── index.css                     # Tailwind CSS directives
│
├── .env                              # Frontend environment config
├── .env.example
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **MongoDB**: Installed locally (`mongodb://localhost:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

---

### 2. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify or edit `.env` in `backend/`:
   ```env
   PORT=5001
   HOST=0.0.0.0
   MONGO_URI=mongodb://127.0.0.1:27017/personal_finance
   JWT_SECRET=super_secret_jwt_key_personal_finance_dashboard_2026
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API will start listening on `http://0.0.0.0:5001` (accessible via localhost and your Wi-Fi LAN IP).*

---

### 3. Frontend Setup
1. Open a new terminal in the project root directory:
   ```bash
   cd "c:\Users\yelur\OneDrive\Desktop\Personal Finance Dashboard"
   ```
2. Start the Vite development server with LAN network exposure:
   ```bash
   npm run dev
   ```
3. Vite will display both access URLs:
   - **Local**: `http://localhost:5173` (on your computer)
   - **Network**: `http://<your-lan-ip>:5173` (open this on your phone or other devices on the same Wi-Fi)

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create user account (`name`, `email`, `password`, `currency?`)
- `POST /api/auth/login` - Authenticate & obtain JWT (`email`, `password`)
- `GET /api/auth/me` - Get current authenticated user profile (`Bearer <token>`)

### Transactions
- `GET /api/transactions` - Filtered & paginated transactions
  - Query params: `page`, `limit`, `type`, `category`, `search`, `startDate`, `endDate`, `sortBy`, `sortOrder`
- `POST /api/transactions` - Create transaction (`title`, `amount`, `type`, `category`, `date`, `paymentMethod`, `description`)
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets?month=X&year=Y` - Fetch monthly budgets with calculated spent and remaining
- `POST /api/budgets` - Create monthly budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Dashboard & Analytics
- `GET /api/dashboard/summary` - Aggregate metrics (total balance, income, expenses, monthly budget, recent transactions)
- `GET /api/analytics?month=X&year=Y` - Aggregated annual trends, category breakdowns, and income vs. expense comparison

---

## 🛡️ Security Features
- Strict user data isolation: all transaction, budget, and aggregation queries are scoped to `req.user._id`.
- Passwords hashed using `bcryptjs` with salt rounds.
- Passwords excluded by default from JSON outputs.
- `helmet` protection against well-known web vulnerabilities.
- Protected API routes using standard JWT Bearer token authentication.
