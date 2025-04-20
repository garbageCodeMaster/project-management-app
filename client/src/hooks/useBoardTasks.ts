import { useQuery } from '@tanstack/react-query';
import { api } from '../api/api';
import { Task } from '../api/utils';

export const useBoardTasks = (boardId: number | string) => {
  return useQuery<Task[]>({
    queryKey: ['board-tasks', boardId],
    queryFn: async () => {
      const res = await api.get<Task[]>(`/boards/${boardId}`);
      return res.data;
    },
    enabled: !!boardId,
  });
};
