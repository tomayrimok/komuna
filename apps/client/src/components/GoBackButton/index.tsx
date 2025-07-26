import { Icon, IconButton, IconButtonProps } from '@chakra-ui/react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useCanGoBack, useRouter } from '@tanstack/react-router';

export interface GoBackButtonProps extends Omit<IconButtonProps, 'css'> {
  onGoBack?: () => void;
  iconButtonProps?: IconButtonProps;
  iconDirection?: 'left' | 'right';
}

export const GoBackButton = ({ onGoBack, iconDirection = 'right', ...rest }: GoBackButtonProps) => {
  const { history } = useRouter();
  const canGoBack = useCanGoBack();

  const goBack = () => {
    if (onGoBack) return onGoBack();
    history.back();
  };

  if (!canGoBack) return null;
  return (
    <IconButton variant={"ghost"} aria-label="back" size="md" onClick={goBack} {...rest} >
      <Icon size={"lg"} as={iconDirection === 'left' ? IconArrowLeft : IconArrowRight} color={"brand.900"} />
    </IconButton>
  );
};
