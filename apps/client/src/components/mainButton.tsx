import { Button } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface MainButtonProps extends PropsWithChildren {
    isLight?: boolean;
    isFixed?: boolean;
    bottom?: string;
    onClick?: () => void;
    loading?: boolean;
}

const MainButton: React.FC<MainButtonProps> = ({ isLight = false, isFixed = true, bottom = "110px", onClick, children, loading = false }) => {

    return (
        <Button
            onClick={onClick}
            width="fit-content"
            fontSize={'lg'}
            py={6}
            loading={loading}
            zIndex={isFixed ? 1 : 0}
            {...(isFixed ? {
                fontWeight: 'bold',
                shadow: 'md',
                position: 'fixed',
                margin: "auto",
                bottom: bottom,
                right: 0,
                left: 0
            } : {})}
            {...(isLight ? {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                _hover: {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                },
                border: '1px solid white'
            } : {})}
        >
            {children}
        </Button>
    );
};

export default MainButton;
