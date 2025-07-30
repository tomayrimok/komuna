import { Icon, IconButton, IconButtonProps } from '@chakra-ui/react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { useIsRTL } from '../../hooks/useIsRTL';

export interface GoBackButtonProps extends Omit<IconButtonProps, 'css'> {
  onGoBack?: () => void;
  iconButtonProps?: IconButtonProps;
}

export const GoBackButton = ({ onGoBack, ...rest }: GoBackButtonProps) => {
  const { history } = useRouter();
  const canGoBack = useCanGoBack();
  const { isRTL } = useIsRTL();

  const goBack = () => {
    if (onGoBack) return onGoBack();
    history.back();
  };

  if (!canGoBack) return null;
  return (
    <IconButton variant={"ghost"} aria-label="back" size="md" onClick={goBack} {...rest} >
      <Icon size={"lg"} as={isRTL ? IconArrowRight : IconArrowLeft} color={"brand.900"} />
    </IconButton>
  );
};
