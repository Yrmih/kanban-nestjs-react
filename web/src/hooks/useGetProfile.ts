import { useQuery } from '@tanstack/react-query';
import { useAuthStoreActions } from '../stores/auth-store';
import { getProfile } from '../services/auth.service';
import { userKeys } from '../utils/query-keys-factories';
import type { UserProfile } from '../types';
import type { AxiosError } from 'axios';

export function useGetProfile(token?: string) {
  const { setUser } = useAuthStoreActions();

  return useQuery<UserProfile, AxiosError>({
    queryKey: userKeys.profile,
    queryFn: () => getProfile(token),
    enabled: !!token,
    onSuccess: (data) => {
      setUser(data);
    }
  });
}
