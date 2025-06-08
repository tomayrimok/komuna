import { FormatNumber, SkeletonText, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useUserBalanceDetails } from '../../hooks/useUserBalanceDetails';
import { roundUpToXDigits } from '../../utilities/roundUpToXDigits';

const BalanceText = () => {

    const { t } = useTranslation();
    const { data, isLoading } = useUserBalanceDetails();

    if (isLoading || !data) {
        return <SkeletonText noOfLines={2} width="50%" m="auto" mb="2" />;
    }

    return (
        <>
            <Text fontWeight={'bold'} fontSize={data.balance === 0 ? '4xl' : 'lg'}>
                {data.balance < 0
                    ? t('payments.debt')
                    : data.balance === 0
                        ? t('payments.balanced')
                        : t('payments.people-owe-you')}
            </Text>
            {data.balance !== 0 && (
                <Text fontSize="4xl" fontWeight={'bold'}>
                    <FormatNumber value={roundUpToXDigits(Math.abs(data.balance))} />

                    <Text fontSize={'2xl'} as="span" me={1}>
                        ₪
                    </Text>
                </Text>
            )}
        </>
    );
};

export default BalanceText;
