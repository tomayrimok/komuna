import { HStack, IconButton } from '@chakra-ui/react';
import { IconArrowLeft } from '@tabler/icons-react';
import { useCanGoBack, useRouter } from '@tanstack/react-router';

export interface BackNavigationBarProps {
  disableGoBack?: boolean;
  onGoBack?: () => void;
}

export const BackNavigationBar = ({ disableGoBack = false, onGoBack }: BackNavigationBarProps) => {
  const { history } = useRouter();
  const canGoBack = useCanGoBack();

  const goBack = () => {
    if (onGoBack) return onGoBack();
    history.back();
  };

  return (
    <HStack justifyContent="flex-end" paddingX="4">
      {(onGoBack || (!disableGoBack && !canGoBack)) && (
        <IconButton aria-label="back" size="2xl" onClick={goBack}>
          <IconArrowLeft width={44} />
        </IconButton>
      )}
    </HStack>
  );
};
