import { HStack } from '@chakra-ui/react';
import { useCanGoBack } from '@tanstack/react-router';
import { GoBackButton } from '../GoBackButton';

export interface BackNavigationBarProps {
  disableGoBack?: boolean;
  onGoBack?: () => void;
}

export const BackNavigationBar = ({ disableGoBack = false, onGoBack }: BackNavigationBarProps) => {
  const canGoBack = useCanGoBack();

  return (
    <HStack justifyContent="flex-end" paddingX="4">
      {(onGoBack || (!disableGoBack && !canGoBack)) && <GoBackButton />}
    </HStack>
  );
};
