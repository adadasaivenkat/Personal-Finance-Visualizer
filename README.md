# Personal Finance Visualizer

A modern, responsive MERN-based web application for managing financial transactions, visualizing spending patterns, and setting budgets—no login required.

---

**Data Modes: Public & Private**
- You can use all features whether you are logged in or not.
- **Not logged in:** You access and manage public/shared data.
- **Logged in:** You access your own private data.
- Logging in or out instantly switches between your personal and public data.
- All features are available in both modes; only the data is different.

---

## Features
- Add, edit, and delete transactions
- Input: amount, date, description, category
- View all transactions (most recent first)
- Dashboard: total expenses, total budget, recent transactions, category breakdown (Pie), monthly expenses (Bar), budget vs actual (Bar)
- Set/update monthly budgets by category
- Real-time overspending alerts
- Visual feedback and form validation

## Tech Stack
- **Frontend:** React (Vite, JSX), Tailwind CSS, shadcn/ui, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Language:** JavaScript & JSX only

## Setup

### 1. MongoDB
Create `/server/.env`:
```
MONGO_URL=your_mongodb_connection_string
```

### 2. Client Environment Variables
Create `/client/.env`:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Backend
```
cd server
npm install
node server.js
```

### 4. Frontend
```
cd client
npm install
npm run dev
```

---

## Folder Structure
```
personal-finance-visualizer/
├── client/
├── server/
└── README.md
``` 
