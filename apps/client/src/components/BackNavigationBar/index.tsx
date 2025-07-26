import { HStack, StackProps } from '@chakra-ui/react';
import { useCanGoBack } from '@tanstack/react-router';
import { GoBackButton } from '../GoBackButton';

export interface BackNavigationBarProps extends Omit<StackProps, 'css'> {
  disableGoBack?: boolean;
  onGoBack?: () => void;
}

export const BackNavigationBar = ({ disableGoBack = false, onGoBack, ...rest }: BackNavigationBarProps) => {
  const canGoBack = useCanGoBack();

  return (
    <HStack {...rest}>
      {(onGoBack || (!disableGoBack && !canGoBack)) && <GoBackButton onGoBack={onGoBack} />}
    </HStack>
  );
};
