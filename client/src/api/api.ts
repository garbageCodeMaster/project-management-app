import axios, { AxiosResponse } from 'axios';
import { Task, CreateTask, UpdateTask } from '../api/utils';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  transformResponse: (data) => {
    try {
      const parsed = JSON.parse(data);
      return parsed.data;
    } catch (error) {
      return data;
    }
  },
});

export const updateTaskStatus = (taskId: number, status: Task["status"]) => {
  return api.put(`/tasks/updateStatus/${taskId}`, { status });
};

export const updateTask = (taskId: number, data: UpdateTask) => {
  return api.put(`/tasks/update/${taskId}`, data);
};

export const createTask = (data: CreateTask): Promise<AxiosResponse<Pick<Task, "id">>> => {
  return api.post('/tasks/create', data);
};

export const getTaskById = (taskId: number): Promise<AxiosResponse<Task>> => {
  return api.get(`/tasks/${taskId}`);
};
