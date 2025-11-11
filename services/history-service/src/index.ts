import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'history-service',
      status: 'healthy',
      timestamp: new Date(),
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 history-service running on port ${PORT}`);
});
