import { useAuth } from '../context/auth/AuthProvider';
import { useMemo } from 'react';

export const useRolePath = (): string => {
  const { sessionDetails } = useAuth();
  return useMemo(() => `/${sessionDetails.role?.toLowerCase()}`, [sessionDetails.role]);
};
