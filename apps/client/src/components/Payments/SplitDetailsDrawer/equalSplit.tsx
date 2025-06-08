import { Flex, Text } from '@chakra-ui/react';
import UserCard from '../../General/userCard';
import { useExpense } from '../../../context/payments/ExpenseProvider';
import { useTranslation } from 'react-i18next';

interface EqualSplitProps {
  toggleSelectUser: (userId: string) => void;
}

const EqualSplit: React.FC<EqualSplitProps> = ({ toggleSelectUser }) => {
  const { users, selectedUserIds } = useExpense();
  const { t } = useTranslation();

  return (
    <>
      <Text fontSize="lg" mb={6} textAlign="center">
        {t('payments.expense.split-equal-split-title')}
      </Text>
      <Flex direction="column" gap={2} mt={2}>
        {users.map(
          (user) =>
            user && (
              <UserCard
                key={user.userId}
                user={user}
                selected={selectedUserIds.has(user.userId)}
                onClick={() => toggleSelectUser(user.userId)}
              />
            )
        )}
      </Flex>
    </>
  );
};
export default EqualSplit;
