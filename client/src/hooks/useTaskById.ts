import { useQuery } from '@tanstack/react-query';
import { api } from '../api/api';
import { Task } from '../api/utils';

export const useTaskById = (taskId: number | string) => {
  if (/^[-+]?\d+$/.test(String(taskId).trim())=== false) {
    return useQuery({
      queryKey: [],
      queryFn: async () => {
        return null;
      },
      enabled: false,
    }); 
  }

  return useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const res = await api.get<Task>(`/tasks/${taskId}`);
      return res.data;
    },
    enabled: !!taskId,
  });
};
