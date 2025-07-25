import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useCanGoBack, useRouter } from '@tanstack/react-router';

export interface GoBackButtonProps extends Omit<IconButtonProps, 'css'> {
  onGoBack?: () => void;
  iconButtonProps?: IconButtonProps;
  iconDirection?: 'left' | 'right';
}

export const GoBackButton = ({ onGoBack, iconDirection = 'left', ...rest }: GoBackButtonProps) => {
  const { history } = useRouter();
  const canGoBack = useCanGoBack();

  const goBack = () => {
    if (onGoBack) return onGoBack();
    history.back();
  };

  if (!canGoBack) return null;
  return (
    <IconButton aria-label="back" size="2xl" onClick={goBack} me={-3} {...rest} >
      {iconDirection === 'left' ? <IconArrowLeft width={44} /> : <IconArrowRight width={44} />}
    </IconButton>
  );
};
