import { useState } from 'react';

interface Subtask {
  id: string;
  title: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks?: Subtask[];
  loadingAI?: boolean;
}

export function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Learn Prompt Engineering', completed: true },
    { id: '2', title: 'Setup Git & GitHub', completed: true },
    { id: '3', title: 'Build Express Backend Server', completed: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      subtasks: [],
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const handleGenerateSubtasks = async (taskId: string, taskTitle: string) => {
    // עדכון מצב הטעינה של המשימה הספציפית
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, loadingAI: true } : t))
    );

    try {
      const response = await fetch('http://localhost:5000/api/tasks/suggest-subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle }),
      });

      const data = await response.json();

      if (data.subtasks) {
        const formattedSubtasks: Subtask[] = data.subtasks.map((st: string, idx: number) => ({
          id: `${taskId}-${idx}`,
          title: st,
        }));

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: formattedSubtasks, loadingAI: false }
              : t
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch AI subtasks:', error);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, loadingAI: false } : t))
      );
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>DevTask AI 🚀</h1>

      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter a new task..."
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              padding: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              marginBottom: '12px',
              backgroundColor: '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none', fontWeight: 'bold' }}>
                {task.title}
              </span>
              <button
                onClick={() => handleGenerateSubtasks(task.id, task.title)}
                disabled={task.loadingAI}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  cursor: task.loadingAI ? 'not-allowed' : 'pointer',
                  backgroundColor: '#6200ee',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                {task.loadingAI ? 'Generating...' : '✨ AI Subtasks'}
              </button>
            </div>

            {/* תצוגת תת-משימות שהתקבלו מה-AI */}
            {task.subtasks && task.subtasks.length > 0 && (
              <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#555' }}>
                {task.subtasks.map((sub) => (
                  <li key={sub.id} style={{ fontSize: '14px', marginTop: '4px' }}>
                    {sub.title}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;