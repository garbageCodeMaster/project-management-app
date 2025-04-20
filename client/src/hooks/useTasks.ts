import { useQuery } from '@tanstack/react-query';
import { api } from '../api/api';
import { Task } from '../api/utils';

export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get<Task[]>('/tasks');
      return res.data;
    },
  });
};
