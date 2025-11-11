import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'i18n-service',
      status: 'healthy',
      timestamp: new Date(),
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 i18n-service running on port ${PORT}`);
});
