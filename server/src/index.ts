import express from "express";
import cors from "cors";
import routes from "@/routes";
import { seedDatabase } from "@/seed";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/v1', routes);

// 启动服务器
app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}/`);

  // 预置数据库数据
  try {
    await seedDatabase();
  } catch (error) {
    console.error('数据库预置失败:', error);
  }
});
