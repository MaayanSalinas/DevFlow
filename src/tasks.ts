export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export const tasks: Array<Task> = [
  { id: '1', title: 'Learn Prompt Engineering', completed: true },
  { id: '2', title: 'Setup Git & GitHub', completed: true },
  { id: '3', title: 'Build Express Backend Server', completed: false },
];