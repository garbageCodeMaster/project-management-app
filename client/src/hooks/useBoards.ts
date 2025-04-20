import { useQuery } from '@tanstack/react-query';
import { api } from '../api/api';
import { Board } from '../api/utils';

export const useBoards = () => {
  return useQuery<Board[]>({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await api.get<Board[]>('/boards');
      return res.data;
    },
  });
};
