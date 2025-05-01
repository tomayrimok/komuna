import { ComponentProps } from 'react';
import { IconButton } from '@chakra-ui/react';
import { IconLogout2 } from '@tabler/icons-react';
import { useAuth } from '../../context/auth/AuthProvider';

interface LogoutButtonProps {
  size?: ComponentProps<typeof IconButton>['size'];
}

export const LogoutButton = ({ size = '2xl' }: LogoutButtonProps) => {
  const { logout } = useAuth();

  return (
    <IconButton size={size} onClick={logout}>
      <IconLogout2 />
    </IconButton>
  );
};
