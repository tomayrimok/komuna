import {
    Button,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
    IconButton,
    Text,
    Box,
    Icon,
    DialogBackdrop,
    DialogPositioner
} from '@chakra-ui/react';
import { IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ReactNode, useState } from 'react';

interface ConfirmDeleteDialogProps {
    onConfirm: () => void | Promise<void>;
    title?: string;
    message?: string;
    itemName?: string;
    isLoading?: boolean;
    size?: 'sm' | 'lg';
    colorPalette?: string;
    variant?: 'outline' | 'solid' | 'subtle' | 'surface' | 'ghost' | 'plain';
    children?: ReactNode;
    disabled?: boolean;
}

export const ConfirmDeleteDialog = ({
    onConfirm,
    title,
    message,
    itemName,
    isLoading = false,
    size = 'lg',
    colorPalette = 'red',
    variant = 'outline',
    children,
    disabled = false,
    ...props
}: ConfirmDeleteDialogProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = async () => {
        try {
            await onConfirm();
            setIsOpen(false);
        } catch (error) {
            // Error handling is done in the mutation hooks
            console.error('Delete operation failed:', error);
        }
    };

    const defaultTitle = title || t('delete');
    const defaultMessage = message || (
        itemName
            ? t('delete_confirmation.message_with_name', { name: itemName })
            : t('delete_confirmation.message')
    );

    return (
        <DialogRoot size={'sm'} placement={'center'} open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
            <DialogTrigger asChild>
                {children || (
                    <IconButton
                        colorPalette={colorPalette as any}
                        variant={variant as any}
                        size={size as any}
                        disabled={disabled}
                        me="auto"
                        {...props}
                    >
                        <IconTrash />
                    </IconButton>
                )}
            </DialogTrigger>
            <DialogBackdrop />
            <DialogPositioner>

                <DialogContent>
                    <DialogHeader>
                        <Box display="flex" alignItems="center" gap={3}>
                            <Box
                                backgroundColor="red.100"
                                borderRadius="full"
                                p={2}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon size="lg" color="red.600">
                                    <IconAlertTriangle />
                                </Icon>
                            </Box>
                            <DialogTitle fontSize="lg" fontWeight="semibold">
                                {defaultTitle}
                            </DialogTitle>
                        </Box>
                    </DialogHeader>

                    <DialogBody>
                        <Text fontSize={'lg'} color="gray.600">
                            {defaultMessage}
                        </Text>
                    </DialogBody>

                    <DialogFooter justifyContent={'space-between'}>
                        <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                            {t('cancel')}
                        </Button>
                        <Button
                            colorPalette="red"
                            size="sm"
                            onClick={handleConfirm}
                            loading={isLoading}
                        >
                            {t('delete')}
                        </Button>
                    </DialogFooter>

                    <DialogCloseTrigger />
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    );
}; 