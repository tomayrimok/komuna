import { Flex, Text } from "@chakra-ui/react";
import UserCard from "../../General/userCard";
import { User } from "@komuna/types";
import { useExpense } from "../../../context/payments/ExpenseProvider";

interface EqualSplitProps {
    toggleSelectUser: (userId: string) => void;
}

const EqualSplit: React.FC<EqualSplitProps> = ({ toggleSelectUser }) => {

    const { users, selectedUserIds } = useExpense();

    return (
        <>
            <Text fontSize="lg" mb={6} textAlign="center">
                בחירת השותפים שהשתתפו בהוצאה, וחלוקה שווה ביניהם
            </Text>
            {/* //todo noam */}
            <Flex direction="column" gap={2} mt={2}>
                {users.map(user => user && (
                    <UserCard
                        key={user.userId}
                        user={user}
                        selected={selectedUserIds.has(user.userId)}
                        onClick={() => toggleSelectUser(user.userId)}
                    />
                ))}
            </Flex>
        </>
    );
};
export default EqualSplit;
