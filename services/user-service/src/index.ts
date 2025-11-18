import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'user-service',
      status: 'healthy',
      timestamp: new Date(),
    },
  });
});

// User routes placeholder
app.post('/api/users/register', (req, res) => {
  res.json({ success: true, message: 'Registration endpoint' });
});

app.post('/api/users/login', (req, res) => {
  res.json({ success: true, message: 'Login endpoint' });
});

app.get('/api/users/profile', (req, res) => {
  res.json({ success: true, message: 'Profile endpoint' });
});

app.listen(PORT, () => {
  console.log(`🚀 user-service running on port ${PORT}`);
});
