import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'recommendations-service',
      status: 'healthy',
      timestamp: new Date(),
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 recommendations-service running on port ${PORT}`);
});
