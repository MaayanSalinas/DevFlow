import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { tasks, Task } from './tasks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'DevTask AI Server is running!' });
});

// GET /api/tasks - קבלת כל המשימות
app.get('/api/tasks', (req: Request, res: Response) => {
  res.status(200).json(tasks);
});

// POST /api/tasks - יצירת משימה חדשה
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask: Task = {
    id: (tasks.length + 1).toString(),
    title,
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});