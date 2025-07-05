const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transactionsRouter = require('./routes/transactions');
const budgetsRouter = require('./routes/budgets');

app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });  
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 