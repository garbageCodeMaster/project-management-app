export const taskStatuses = ['Backlog', 'InProgress', 'Done'] as const;
export const taskPriorities = ['Low', 'Medium', 'High'] as const;

export type Task = {
  id: number;
  title: string;
  description: string;
  status: typeof taskStatuses[number];
  priority: typeof taskPriorities[number];
  boardId: number;
  boardName: string;
  assignee?: {
    id: number;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
}

export type UpdateTask = {assigneeId: number} & Pick<Task, 'title' | 'description' | 'status' | 'priority'>;
export type CreateTask = {boardId: number, assigneeId: number} & Pick<Task, 'title' | 'description' | 'priority'>;

export type Board = {
  id: number;
  name: string;
  description: string;
  taskCount: number;
}

export type User = {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
}
