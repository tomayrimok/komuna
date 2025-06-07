import { Button } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface MainButtonProps extends PropsWithChildren {
    isLight?: boolean;
    isFixed?: boolean;
    onClick?: () => void;
}

const MainButton: React.FC<MainButtonProps> = ({ isLight = false, isFixed = true, onClick, children }) => {

    return (
        <Button
            onClick={onClick}
            width="fit-content"
            fontSize={'lg'}
            fontWeight={'bold'}
            py={6}
            shadow={'md'}
            {...(isFixed ? {
                position: 'fixed',
                margin: "auto",
                bottom: "110px",
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
