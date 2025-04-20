import { useQuery } from '@tanstack/react-query';
import { api } from '../api/api';
import { User } from '../api/utils';


export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get<User[]>('/users');
      return res.data;
    },
  });
};
