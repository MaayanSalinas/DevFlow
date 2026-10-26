import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { tasks, Task } from './tasks';
import { generateSubtasks } from './aiService';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
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

// POST /api/tasks/suggest-subtasks - פירוק משימה בעזרת AI
app.post('/api/tasks/suggest-subtasks', async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  try {
    const subtasks = await generateSubtasks(title);
    res.status(200).json({ parentTask: title, subtasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI subtasks' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});