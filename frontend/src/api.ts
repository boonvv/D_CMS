export type User = {
  id: string;
  email: string;
  username: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  projectId: string;
  createdById: string;
  createdAt: string;
  completedAt?: string | null;
};

export type Project = {
  id: string;
  title: string;
  description?: string | null;
  createdById: string;
  createdAt: string;
  updatedAt?: string | null;
  tasks: Task[];
};
